import { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView, FlatList, Modal, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import colors from '../util/constant';

// Mock friends data
const mockFriends = [
  {
    id: '1',
    name: 'John Smith',
    username: '@johnsmith',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    phone: '+1 234 567 8901',
    lastActive: '2 hours ago'
  },
  {
    id: '2',
    name: 'Emma Wilson',
    username: '@emmaw',
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    phone: '+1 234 567 8902',
    lastActive: '5 hours ago'
  },
  {
    id: '3',
    name: 'Michael Brown',
    username: '@michaelb',
    avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
    phone: '+1 234 567 8903',
    lastActive: '1 day ago'
  },
  {
    id: '4',
    name: 'Sarah Davis',
    username: '@sarahd',
    avatar: 'https://randomuser.me/api/portraits/women/4.jpg',
    phone: '+1 234 567 8904',
    lastActive: '3 days ago'
  }
];

// Add group types data
const groupTypes = {
  'Travel & Adventure': [
    'Road Trip', 'Vacation', 'Backpacking', 'Weekend Getaway', 'Camping',
    'International Travel', 'Beach Trip', 'Mountain Expedition', 'City Tour',
    'Adventure Sports'
  ],
  'Home & Living': [
    'Roommates', 'Family', 'Household', 'Utilities', 'Rent Split',
    'Home Improvement', 'Garden & Lawn', 'Furniture', 'Appliances', 'Decor'
  ],
  'Food & Dining': [
    'Dinner Group', 'Lunch Buddies', 'Brunch Club', 'Restaurant Hopping',
    'Cooking Club', 'Food Festival', 'Wine Tasting', 'BBQ Party', 'Potluck',
    'Food Delivery'
  ],
  'Entertainment': [
    'Movie Night', 'Game Night', 'Concert Group', 'Theater', 'Sports Events',
    'Book Club', 'Music Festival', 'Party Planning', 'Comedy Shows', 'Art Events'
  ],
  'Sports & Fitness': [
    'Gym Buddies', 'Sports Team', 'Hiking Group', 'Yoga Class', 'Running Club',
    'Cycling Group', 'Swimming', 'Tennis Partners', 'Basketball Team', 'Golf'
  ]
};

export default function CreateGroup() {
  const router = useRouter();
  const [groupName, setGroupName] = useState('');
  const [groupImage, setGroupImage] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMembers, setSelectedMembers] = useState(new Set());
  const [errors, setErrors] = useState({
    groupName: '',
    groupType: '',
    members: ''
  });

  const filteredFriends = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return mockFriends.filter(friend => 
      friend.name.toLowerCase().includes(query) || 
      friend.username.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!groupName.trim()) {
      newErrors.groupName = 'Group name is required';
    } else if (groupName.length < 3) {
      newErrors.groupName = 'Group name must be at least 3 characters';
    }

    if (!selectedType) {
      newErrors.groupType = 'Please select a group type';
    }

    if (selectedMembers.size === 0) {
      newErrors.members = 'Please select at least one member';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateGroup = () => {
    if (validateForm()) {
      const selectedFriends = mockFriends.filter(friend => selectedMembers.has(friend.id));
      console.log('Creating group:', {
        name: groupName,
        type: selectedType,
        members: selectedFriends,
        image: groupImage
      });
      router.back();
    }
  };

  const toggleMemberSelection = (friendId) => {
    setSelectedMembers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(friendId)) {
        newSet.delete(friendId);
      } else {
        newSet.add(friendId);
      }
      return newSet;
    });
  };

  const renderTypeItem = ({ item, section }) => (
    <Pressable
      style={[
        styles.typeItem,
        selectedType === item && styles.typeItemSelected
      ]}
      onPress={() => {
        setSelectedType(item);
        setShowTypeModal(false);
      }}
    >
      <Text style={[
        styles.typeText,
        selectedType === item && styles.typeTextSelected
      ]}>{item}</Text>
    </Pressable>
  );

  const renderSectionHeader = ({ section: { title } }) => (
    <Text style={styles.sectionHeader}>{title}</Text>
  );

  const renderStepOne = () => (
    <ScrollView style={styles.content}>
      <Pressable 
        style={styles.imageContainer}
        onPress={() => console.log('Select image')}
      >
        {groupImage ? (
          <Image
            source={groupImage}
            style={styles.groupImage}
            contentFit="cover"
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Ionicons name="image-outline" size={32} color="#666" />
            <Text style={styles.imagePlaceholderText}>Add Group Photo</Text>
          </View>
        )}
      </Pressable>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Group Name</Text>
        <TextInput
          style={[styles.input, errors.groupName && styles.inputError]}
          value={groupName}
          onChangeText={setGroupName}
          placeholder="Enter a group name"
          placeholderTextColor="#999"
        />
        {errors.groupName ? (
          <Text style={styles.errorText}>{errors.groupName}</Text>
        ) : null}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Group Type</Text>
        <Pressable
          style={[styles.input, errors.groupType && styles.inputError]}
          onPress={() => setShowTypeModal(true)}
        >
          <Text style={selectedType ? styles.inputText : styles.placeholderText}>
            {selectedType || 'Select a group type'}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#666" />
        </Pressable>
        {errors.groupType ? (
          <Text style={styles.errorText}>{errors.groupType}</Text>
        ) : null}
      </View>
    </ScrollView>
  );

  const renderStepTwo = () => (
    <View style={styles.content}>
      <View style={styles.searchContainer}>
        <View style={styles.searchWrapper}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search friends..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
          {searchQuery ? (
            <Pressable onPress={() => setSearchQuery('')} style={styles.clearButton}>
              <Ionicons name="close-circle" size={20} color="#999" />
            </Pressable>
          ) : null}
        </View>
      </View>

      {selectedMembers.size > 0 && (
        <View style={styles.selectedCount}>
          <Text style={styles.selectedCountText}>
            {selectedMembers.size} member{selectedMembers.size > 1 ? 's' : ''} selected
          </Text>
        </View>
      )}

      {errors.members ? (
        <Text style={[styles.errorText, { marginHorizontal: 16 }]}>{errors.members}</Text>
      ) : null}

      <ScrollView style={styles.friendsList}>
        {filteredFriends.length > 0 ? (
          filteredFriends.map(friend => (
            <Pressable
              key={friend.id}
              style={[
                styles.friendCard,
                selectedMembers.has(friend.id) && styles.friendCardSelected
              ]}
              onPress={() => toggleMemberSelection(friend.id)}
            >
              <View style={styles.friendInfo}>
                <Image
                  source={{ uri: friend.avatar }}
                  style={styles.friendAvatar}
                />
                <View style={styles.friendDetails}>
                  <Text style={styles.friendName}>{friend.name}</Text>
                  <Text style={styles.friendUsername}>{friend.username}</Text>
                  <Text style={styles.friendActivity}>Active {friend.lastActive}</Text>
                </View>
              </View>
              <View style={[
                styles.checkbox,
                selectedMembers.has(friend.id) && styles.checkboxSelected
              ]}>
                {selectedMembers.has(friend.id) && (
                  <Ionicons name="checkmark" size={16} color="white" />
                )}
              </View>
            </Pressable>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="search" size={48} color="#ccc" />
            <Text style={styles.emptyStateTitle}>No friends found</Text>
            <Text style={styles.emptyStateText}>
              Try searching with a different name or username
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </Pressable>
        <Text style={styles.title}>Create New Group</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.formSection}>
          <Pressable 
            style={styles.imageContainer}
            onPress={() => console.log('Select image')}
          >
            {groupImage ? (
              <Image source={groupImage} style={styles.groupImage} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Ionicons name="camera" size={32} color="#666" />
                <Text style={styles.imagePlaceholderText}>Add Group Photo</Text>
              </View>
            )}
          </Pressable>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Group Name</Text>
            <TextInput
              style={[styles.input, errors.groupName && styles.inputError]}
              value={groupName}
              onChangeText={setGroupName}
              placeholder="Enter a group name"
              placeholderTextColor="#999"
            />
            {errors.groupName ? (
              <Text style={styles.errorText}>{errors.groupName}</Text>
            ) : null}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Group Type</Text>
            <Pressable
              style={[styles.input, errors.groupType && styles.inputError]}
              onPress={() => setShowTypeModal(true)}
            >
              <Text style={selectedType ? styles.inputText : styles.placeholderText}>
                {selectedType || 'Select a group type'}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#666" />
            </Pressable>
            {errors.groupType ? (
              <Text style={styles.errorText}>{errors.groupType}</Text>
            ) : null}
          </View>
        </View>

        <View style={styles.membersSection}>
          <Text style={styles.sectionTitle}>Add Members</Text>
          <View style={styles.searchContainer}>
            <View style={styles.searchWrapper}>
              <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search by name or username"
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor="#999"
              />
              {searchQuery ? (
                <Pressable onPress={() => setSearchQuery('')} style={styles.clearButton}>
                  <Ionicons name="close-circle" size={20} color="#999" />
                </Pressable>
              ) : null}
            </View>
          </View>

          {selectedMembers.size > 0 && (
            <View style={styles.selectedCount}>
              <Ionicons name="people" size={20} color="#000" />
              <Text style={styles.selectedCountText}>
                {selectedMembers.size} member{selectedMembers.size > 1 ? 's' : ''} selected
              </Text>
            </View>
          )}

          {errors.members ? (
            <Text style={[styles.errorText, { marginHorizontal: 16 }]}>{errors.members}</Text>
          ) : null}

          <View style={styles.friendsList}>
            {filteredFriends.length > 0 ? (
              filteredFriends.map(friend => (
                <Pressable
                  key={friend.id}
                  style={[
                    styles.friendCard,
                    selectedMembers.has(friend.id) && styles.friendCardSelected
                  ]}
                  onPress={() => toggleMemberSelection(friend.id)}
                >
                  <View style={styles.friendInfo}>
                    <Image
                      source={{ uri: friend.avatar }}
                      style={styles.friendAvatar}
                    />
                    <View style={styles.friendDetails}>
                      <Text style={styles.friendName}>{friend.name}</Text>
                      <Text style={styles.friendUsername}>{friend.username}</Text>
                      <Text style={styles.friendActivity}>Active {friend.lastActive}</Text>
                    </View>
                  </View>
                  <View style={[
                    styles.checkbox,
                    selectedMembers.has(friend.id) && styles.checkboxSelected
                  ]}>
                    {selectedMembers.has(friend.id) && (
                      <Ionicons name="checkmark" size={16} color="white" />
                    )}
                  </View>
                </Pressable>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="search" size={48} color="#ccc" />
                <Text style={styles.emptyStateTitle}>No friends found</Text>
                <Text style={styles.emptyStateText}>
                  Try searching with a different name or username
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable 
          style={[
            styles.createButton,
            selectedMembers.size === 0 && styles.createButtonDisabled
          ]} 
          onPress={handleCreateGroup}
        >
          <Text style={[
            styles.createButtonText,
            selectedMembers.size === 0 && styles.createButtonTextDisabled
          ]}>
            Create Group
          </Text>
        </Pressable>
      </View>

      <Modal
        visible={showTypeModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Group Type</Text>
            <Pressable 
              style={styles.closeButton}
              onPress={() => setShowTypeModal(false)}
            >
              <Ionicons name="close" size={24} color="#000" />
            </Pressable>
          </View>
          
          <ScrollView>
            {Object.entries(groupTypes).map(([category, types]) => (
              <View key={category} style={styles.categorySection}>
                <Text style={styles.categoryTitle}>{category}</Text>
                <View style={styles.typeGrid}>
                  {types.map(type => (
                    <Pressable
                      key={type}
                      style={[
                        styles.typeItem,
                        selectedType === type && styles.typeItemSelected
                      ]}
                      onPress={() => {
                        setSelectedType(type);
                        setShowTypeModal(false);
                      }}
                    >
                      <Text style={[
                        styles.typeText,
                        selectedType === type && styles.typeTextSelected
                      ]}>{type}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            ))}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  content: {
    flex: 1,
  },
  formSection: {
    padding: 16,
    gap: 20,
  },
  imageContainer: {
    alignSelf: 'center',
    marginBottom: 8,
  },
  imagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
  },
  imagePlaceholderText: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  groupImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#000',
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputError: {
    borderColor: '#ff4444',
  },
  inputText: {
    fontSize: 16,
    color: '#000',
  },
  placeholderText: {
    fontSize: 16,
    color: '#999',
  },
  errorText: {
    fontSize: 12,
    color: '#ff4444',
    marginTop: 4,
  },
  membersSection: {
    flex: 1,
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#000',
  },
  clearButton: {
    padding: 4,
  },
  selectedCount: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
  },
  selectedCountText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
  },
  friendsList: {
    paddingHorizontal: 16,
    gap: 12,
  },
  friendCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  friendCardSelected: {
    borderColor: '#000',
    backgroundColor: '#fafafa',
  },
  friendInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  friendAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f0f0f0',
  },
  friendDetails: {
    flex: 1,
  },
  friendName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
  },
  friendUsername: {
    fontSize: 13,
    color: '#666',
    marginBottom: 2,
  },
  friendActivity: {
    fontSize: 12,
    color: '#888',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 12,
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  emptyStateText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  createButton: {
    backgroundColor: '#000',
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createButtonDisabled: {
    backgroundColor: '#f0f0f0',
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  createButtonTextDisabled: {
    color: '#999',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  closeButton: {
    padding: 4,
  },
  categorySection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f8f8f8',
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  typeItemSelected: {
    backgroundColor: 'black',
    borderColor: 'black',
  },
  typeText: {
    fontSize: 14,
    color: '#000',
  },
  typeTextSelected: {
    color: 'white',
  },
}); 