import { useState } from 'react';
import { View, Text, StyleSheet, Pressable, FlatList, TextInput, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../util/constant';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Contacts from 'expo-contacts';

export default function AddFriend() {
  const router = useRouter();
  const [hasPermission, setHasPermission] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  const getContacts = async () => {
    const { status } = await Contacts.requestPermissionsAsync();
    setHasPermission(status === 'granted');

    if (status === 'granted') {
      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.Emails],
      });
      setContacts(data);
    }
  };

  const toggleContactSelection = (contact) => {
    const newSelected = new Set(selectedContacts);
    if (newSelected.has(contact.id)) {
      newSelected.delete(contact.id);
    } else {
      newSelected.add(contact.id);
    }
    setSelectedContacts(newSelected);
  };

  const handleAddFriends = () => {
    // Get the selected contacts data
    const selectedContactsData = contacts.filter(contact => 
      selectedContacts.has(contact.id)
    ).map(contact => ({
      id: contact.id,
      name: contact.name,
      phoneNumber: contact.phoneNumbers?.[0]?.number,
      email: contact.emails?.[0]?.email
    }));

    // Log the selected contacts
    console.log('Selected Contacts:', selectedContactsData);
    
    // Here you would typically send this data to your backend
    // For now, we'll just show what was selected
    alert(`Selected ${selectedContactsData.length} contacts`);
    
    router.back();
  };

  const filteredContacts = contacts.filter(contact => {
    const searchLower = searchQuery.toLowerCase();
    return contact.name.toLowerCase().includes(searchLower);
  });

  const renderContact = ({ item }) => (
    <Pressable 
      style={[
        styles.contactItem,
        selectedContacts.has(item.id) && styles.selectedContact
      ]}
      onPress={() => toggleContactSelection(item)}
    >
      <View style={styles.contactAvatar}>
        <Text style={styles.avatarText}>
          {item.name[0].toUpperCase()}
        </Text>
      </View>
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{item.name}</Text>
        {item.phoneNumbers && item.phoneNumbers[0] && (
          <Text style={styles.contactDetail}>{item.phoneNumbers[0].number}</Text>
        )}
      </View>
      {selectedContacts.has(item.id) ? (
        <View style={styles.checkmarkContainer}>
          <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
        </View>
      ) : (
        <View style={styles.uncheckedContainer}>
          <Ionicons name="ellipse-outline" size={24} color="#666" />
        </View>
      )}
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </Pressable>
        <Text style={styles.title}>Add Friends</Text>
        {selectedContacts.size > 0 && (
          <Text style={styles.selectedCount}>
            {selectedContacts.size} selected
          </Text>
        )}
      </View>

      <View style={styles.content}>
        {/* Add New Contact Section */}
        <Pressable 
          style={styles.addNewSection}
          onPress={() => router.push('/new-contact')}
        >
          <View style={styles.addNewIcon}>
            <Ionicons name="person-add" size={24} color={colors.primary} />
          </View>
          <View style={styles.addNewText}>
            <Text style={styles.addNewTitle}>Add a new contact to Splitway</Text>
            <Text style={styles.addNewSubtitle}>Create a new contact</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#666" />
        </Pressable>

        {/* Contacts Section */}
        <View style={styles.contactsSection}>
          <Text style={styles.sectionTitle}>From your contacts</Text>
          
          {!hasPermission ? (
            <View style={styles.permissionContainer}>
              <Ionicons name="people" size={48} color="#666" />
              <Text style={styles.permissionText}>
                Allow Splitway to access your contacts to add friends
              </Text>
              <Pressable 
                style={styles.allowButton}
                onPress={getContacts}
              >
                <Text style={styles.allowButtonText}>Allow Contact Access</Text>
              </Pressable>
            </View>
          ) : (
            <>
              <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search contacts..."
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
                {searchQuery ? (
                  <Pressable onPress={() => setSearchQuery('')}>
                    <Ionicons name="close-circle" size={20} color="#666" />
                  </Pressable>
                ) : null}
              </View>

              <FlatList
                data={filteredContacts}
                renderItem={renderContact}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.contactsList}
                showsVerticalScrollIndicator={false}
              />
            </>
          )}
        </View>
      </View>

      {selectedContacts.size > 0 && (
        <View style={styles.footer}>
          <Pressable 
            style={styles.addFriendButton}
            onPress={handleAddFriends}
          >
            <Text style={styles.addFriendButtonText}>
              Add {selectedContacts.size} {selectedContacts.size === 1 ? 'Friend' : 'Friends'}
            </Text>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
  },
  selectedCount: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  addNewSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  addNewIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${colors.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  addNewText: {
    flex: 1,
  },
  addNewTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  addNewSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  contactsSection: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    padding: 16,
  },
  permissionContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  permissionText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginVertical: 16,
  },
  allowButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  allowButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    margin: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  contactsList: {
    padding: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#f5f5f5',
  },
  selectedContact: {
    backgroundColor: `${colors.primary}15`,
  },
  contactAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '500',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  contactDetail: {
    fontSize: 14,
    color: '#666',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  addFriendButton: {
    backgroundColor: colors.primary,
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addFriendButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  checkmarkContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uncheckedContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 