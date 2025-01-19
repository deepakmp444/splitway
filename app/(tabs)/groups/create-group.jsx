import { View, Text, StyleSheet, TextInput, Pressable, ScrollView, Image, FlatList } from 'react-native';
import { useState, useMemo } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../util/constant';

const groupTypes = {
  "Travel & Adventure": [
    "Road Trip", "Vacation", "Backpacking", "Weekend Getaway", "Camping",
    "International Travel", "Business Trip", "Adventure Sports", "Hiking", "Beach Trip"
  ],
  "Home & Living": [
    "Roommates", "Utilities", "Rent", "Home Improvement", "Furniture",
    "Household Supplies", "Internet & Cable", "Home Maintenance", "Garden", "Home Decor"
  ],
  "Food & Dining": [
    "Restaurant Bills", "Groceries", "Food Delivery", "Meal Prep", "Cooking Club",
    "Dinner Party", "BBQ", "Potluck", "Cafe", "Snacks"
  ],
  "Entertainment": [
    "Movie Night", "Concert", "Theater", "Game Night", "Sports Events",
    "Theme Park", "Museum", "Festival", "Party", "Bar Tab"
  ],
  "Sports & Fitness": [
    "Gym Membership", "Sports Team", "Fitness Classes", "Equipment", "Personal Training",
    "League Fees", "Sports Gear", "Tournament", "Wellness", "Outdoor Activities"
  ]
};

// Mock friends data
const mockFriends = [
  { id: '1', name: 'John Doe', username: '@johndoe', phone: '+1234567890', lastActive: '2 hours ago' },
  { id: '2', name: 'Sarah Smith', username: '@sarahs', phone: '+1234567891', lastActive: '1 day ago' },
  { id: '3', name: 'Mike Johnson', username: '@mikej', phone: '+1234567892', lastActive: '3 days ago' },
  { id: '4', name: 'Emma Wilson', username: '@emmaw', phone: '+1234567893', lastActive: '1 week ago' },
  { id: '5', name: 'Alex Brown', username: '@alexb', phone: '+1234567894', lastActive: '2 weeks ago' },
  { id: '6', name: 'Lisa Davis', username: '@lisad', phone: '+1234567895', lastActive: 'just now' },
];

export default function CreateGroup() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [groupName, setGroupName] = useState('');
  const [groupImage, setGroupImage] = useState(null);
  const [selectedType, setSelectedType] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMembers, setSelectedMembers] = useState(new Set());

  const filteredFriends = useMemo(() => {
    if (!searchQuery.trim()) return mockFriends;
    const query = searchQuery.toLowerCase().trim();
    return mockFriends.filter(friend => 
      friend.name.toLowerCase().includes(query) || 
      friend.username.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const handleNext = () => {
    if (step === 1 && groupName.trim()) {
      setStep(2);
    } else if (step === 2 && selectedType) {
      setStep(3);
    } else if (step === 3 && selectedMembers.size > 0) {
      // Create group logic here
      console.log('Creating group:', { 
        groupName, 
        groupImage, 
        selectedType,
        members: Array.from(selectedMembers)
      });
      router.back();
    }
  };

  const toggleMemberSelection = (memberId) => {
    const newSelected = new Set(selectedMembers);
    if (newSelected.has(memberId)) {
      newSelected.delete(memberId);
    } else {
      newSelected.add(memberId);
    }
    setSelectedMembers(newSelected);
  };

  const renderMemberItem = ({ item }) => (
    <Pressable 
      style={[
        styles.memberCard,
        selectedMembers.has(item.id) && styles.selectedMemberCard
      ]}
      onPress={() => toggleMemberSelection(item.id)}
    >
      <View style={styles.memberAvatar} />
      <View style={styles.memberInfo}>
        <Text style={styles.memberName}>{item.name}</Text>
        <Text style={styles.memberUsername}>{item.username}</Text>
        <Text style={styles.memberLastActive}>Active {item.lastActive}</Text>
      </View>
      {selectedMembers.has(item.id) && (
        <View style={styles.checkmark}>
          <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
        </View>
      )}
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable 
          style={styles.backButton}
          onPress={() => step === 1 ? router.back() : setStep(step - 1)}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </Pressable>
        <Text style={styles.title}>Create New Group</Text>
      </View>

      {step === 1 ? (
        <ScrollView style={styles.content}>
          <View style={styles.step}>
            <View style={styles.imageContainer}>
              <Pressable 
                style={styles.imagePicker}
                onPress={() => {/* Image picker logic */}}
              >
                {groupImage ? (
                  <Image source={{ uri: groupImage }} style={styles.selectedImage} />
                ) : (
                  <View style={styles.imagePrompt}>
                    <Ionicons name="camera" size={32} color={colors.primary} />
                    <Text style={styles.imageText}>Add Group Photo</Text>
                  </View>
                )}
              </Pressable>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Group Name</Text>
              <TextInput
                style={styles.input}
                value={groupName}
                onChangeText={setGroupName}
                placeholder="Enter group name"
                placeholderTextColor="#666"
              />
            </View>
          </View>
        </ScrollView>
      ) : step === 2 ? (
        <ScrollView style={styles.content}>
          <View style={styles.step}>
            <Text style={styles.sectionTitle}>Select Group Type</Text>
            <ScrollView style={styles.typeList}>
              {Object.entries(groupTypes).map(([category, types]) => (
                <View key={category} style={styles.category}>
                  <Text style={styles.categoryTitle}>{category}</Text>
                  <View style={styles.typeGrid}>
                    {types.map(type => (
                      <Pressable
                        key={type}
                        style={[
                          styles.typeButton,
                          selectedType === type && styles.selectedType
                        ]}
                        onPress={() => setSelectedType(type)}
                      >
                        <Text style={[
                          styles.typeText,
                          selectedType === type && styles.selectedTypeText
                        ]}>
                          {type}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        </ScrollView>
      ) : (
        <View style={styles.content}>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search friends..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#666"
            />
            {searchQuery.length > 0 && (
              <Ionicons
                name="close-circle"
                size={20}
                color="#666"
                style={styles.clearIcon}
                onPress={() => setSearchQuery('')}
              />
            )}
          </View>

          <View style={styles.selectedCount}>
            <Text style={styles.selectedCountText}>
              Selected: {selectedMembers.size} members
            </Text>
          </View>

          <FlatList
            data={filteredFriends}
            renderItem={renderMemberItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.membersList}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}

      <View style={styles.footer}>
        <Pressable 
          style={[
            styles.nextButton,
            ((!groupName.trim() && step === 1) || 
             (!selectedType && step === 2) || 
             (selectedMembers.size === 0 && step === 3))
              ? styles.disabledButton
              : null
          ]}
          onPress={handleNext}
          disabled={
            (!groupName.trim() && step === 1) || 
            (!selectedType && step === 2) || 
            (selectedMembers.size === 0 && step === 3)
          }
        >
          <Text style={styles.nextButtonText}>
            {step === 3 ? 'Create Group' : 'Next'}
          </Text>
        </Pressable>
      </View>
    </View>
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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  step: {
    padding: 16,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  imagePicker: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f5f5f5',
    overflow: 'hidden',
  },
  selectedImage: {
    width: '100%',
    height: '100%',
  },
  imagePrompt: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageText: {
    marginTop: 8,
    fontSize: 14,
    color: colors.primary,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  category: {
    marginBottom: 24,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
    color: '#666',
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    marginBottom: 8,
  },
  selectedType: {
    backgroundColor: colors.primary,
  },
  typeText: {
    fontSize: 14,
    color: '#666',
  },
  selectedTypeText: {
    color: 'white',
    fontWeight: '500',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    margin: 16,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    height: '100%',
  },
  clearIcon: {
    marginLeft: 8,
    padding: 4,
  },
  selectedCount: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  selectedCountText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  membersList: {
    padding: 16,
    paddingTop: 0,
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  selectedMemberCard: {
    backgroundColor: colors.primary + '10',
    borderColor: colors.primary,
  },
  memberAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary + '40',
    marginRight: 12,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  memberUsername: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  memberLastActive: {
    fontSize: 12,
    color: '#666',
  },
  checkmark: {
    marginLeft: 12,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  nextButton: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
}); 