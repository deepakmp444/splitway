import { View, Text, StyleSheet, FlatList, Pressable, TextInput, KeyboardAvoidingView, Platform, Keyboard, ScrollView, Dimensions } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect, useRef } from 'react';
import { colors } from '../util/constant';
import { SafeAreaView } from 'react-native-safe-area-context';

const splitMethods = [
  { id: 'equal', name: 'Equal', icon: 'people' },
  { id: 'unequal', name: 'Unequal', icon: 'git-compare' },
  { id: 'percent', name: 'Percent', icon: 'pie-chart' },
];

export default function SplitExpense() {
  const router = useRouter();
  const { groupId, amount } = useLocalSearchParams();
  const [selectedMethod, setSelectedMethod] = useState('equal');
  const [memberSearch, setMemberSearch] = useState('');
  const [selectedMembers, setSelectedMembers] = useState({});
  const [memberShares, setMemberShares] = useState({});

  // Mock group members (replace with actual data)
  const groupMembers = [
    { id: 1, name: 'You' },
    { id: 2, name: 'John' },
    { id: 3, name: 'Sarah' },
    { id: 4, name: 'Mike' },
    ...Array.from({ length: 96 }, (_, i) => ({
      id: i + 5,
      name: `Member ${i + 1}`
    }))
  ];

  // Initialize selected members
  useEffect(() => {
    const initial = Object.fromEntries(groupMembers.map(m => [m.id, true]));
    setSelectedMembers(initial);
  }, []);

  // Initialize shares when amount or split method changes
  useEffect(() => {
    const shares = {};
    const amountNum = parseFloat(amount) || 0;
    const selectedCount = Object.values(selectedMembers).filter(Boolean).length;

    groupMembers.forEach(member => {
      if (selectedMembers[member.id]) {
        if (selectedMethod === 'equal') {
          shares[member.id] = (amountNum / selectedCount).toFixed(2);
        } else {
          shares[member.id] = '0';
        }
      }
    });
    setMemberShares(shares);
  }, [amount, selectedMethod, selectedMembers]);

  const filteredMembers = groupMembers.filter(member =>
    member.name.toLowerCase().includes(memberSearch.toLowerCase())
  );

  const toggleMember = (memberId) => {
    setSelectedMembers(prev => ({
      ...prev,
      [memberId]: !prev[memberId]
    }));
  };

  const updateShare = (memberId, value) => {
    setMemberShares(prev => ({
      ...prev,
      [memberId]: value
    }));
  };

  const calculateRemainingAmount = () => {
    const amountNum = parseFloat(amount) || 0;
    const totalShares = Object.values(memberShares)
      .reduce((sum, share) => sum + (parseFloat(share) || 0), 0);
    return (amountNum - totalShares).toFixed(2);
  };

  const calculateRemainingPercentage = () => {
    const totalPercent = Object.values(memberShares)
      .reduce((sum, share) => sum + (parseFloat(share) || 0), 0);
    return (100 - totalPercent).toFixed(2);
  };

  const handleSave = () => {
    router.back({
      params: {
        splitMethod: selectedMethod,
        shares: memberShares,
        selectedMembers
      }
    });
  };

  // Add ref for FlatList to scroll to focused input
  const flatListRef = useRef(null);
  const [focusedId, setFocusedId] = useState(null);

  // Function to scroll to focused input
  const scrollToInput = (index) => {
    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({
        index,
        animated: true,
        viewPosition: 0.5
      });
    }
  };

  // Add keyboard handling
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        if (flatListRef.current && focusedId) {
          const index = filteredMembers.findIndex(m => m.id === focusedId);
          if (index !== -1) {
            setTimeout(() => {
              scrollToInput(index);
            }, 100);
          }
        }
      }
    );

    return () => {
      keyboardDidShowListener.remove();
    };
  }, [focusedId, filteredMembers]);

  // Remove flatListRef and scrollToInput as we're changing the approach
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const screenHeight = Dimensions.get('window').height;

  // Update keyboard handling
  useEffect(() => {
    const keyboardWillShow = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const keyboardWillHide = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const keyboardShow = Keyboard.addListener(keyboardWillShow, (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });

    const keyboardHide = Keyboard.addListener(keyboardWillHide, () => {
      setKeyboardHeight(0);
    });

    return () => {
      keyboardShow.remove();
      keyboardHide.remove();
    };
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Pressable 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="black" />
          </Pressable>
          <Text style={styles.headerTitle}>Split Expense</Text>
        </View>
        <Pressable 
          style={styles.saveButton}
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>Done</Text>
        </Pressable>
      </View>

      <View style={styles.tabs}>
        {splitMethods.map((method) => (
          <Pressable
            key={method.id}
            style={[
              styles.tab,
              selectedMethod === method.id && styles.selectedTab
            ]}
            onPress={() => setSelectedMethod(method.id)}
          >
            <Ionicons 
              name={method.icon} 
              size={20} 
              color={selectedMethod === method.id ? colors.primary : '#666'} 
            />
            <Text style={[
              styles.tabText,
              selectedMethod === method.id && styles.selectedTabText
            ]}>{method.name}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.searchRow}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={18} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search members..."
            value={memberSearch}
            onChangeText={setMemberSearch}
          />
        </View>
        {selectedMethod !== 'equal' && (
          <View style={styles.remainingContainer}>
            <Text style={styles.remainingText}>
              {selectedMethod === 'unequal' 
                ? `$${calculateRemainingAmount()}`
                : `${calculateRemainingPercentage()}%`
              }
            </Text>
            <Text style={styles.remainingLabel}>Remaining</Text>
          </View>
        )}
      </View>

      <View style={[
        styles.mainContent,
        { maxHeight: screenHeight - keyboardHeight - (Platform.OS === 'ios' ? 180 : 140) }
      ]}>
        <ScrollView 
          style={styles.scrollView}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: keyboardHeight > 0 ? keyboardHeight + 20 : 20 }
          ]}
        >
          {filteredMembers.map((item, index) => (
            <Pressable 
              key={item.id}
              style={[
                styles.memberItem,
                selectedMembers[item.id] && styles.selectedMemberItem,
                focusedId === item.id && styles.focusedMemberItem
              ]}
              onPress={() => {
                if (focusedId === item.id) {
                  Keyboard.dismiss();
                  setFocusedId(null);
                } else {
                  toggleMember(item.id);
                }
              }}
            >
              <View style={styles.memberContent}>
                <View style={styles.memberLeft}>
                  <View style={[styles.memberAvatar, { backgroundColor: colors.primary + '20' }]}>
                    <Text style={styles.memberInitial}>{item.name.charAt(0)}</Text>
                  </View>
                  <Text style={[
                    styles.memberName,
                    selectedMembers[item.id] && styles.selectedMemberName
                  ]}>{item.name}</Text>
                </View>
                <Ionicons 
                  name={selectedMembers[item.id] ? "checkmark-circle" : "ellipse-outline"} 
                  size={24} 
                  color={selectedMembers[item.id] ? colors.primary : '#ddd'} 
                />
              </View>
              
              {selectedMembers[item.id] && selectedMethod !== 'equal' && (
                <Pressable
                  style={styles.shareInputContainer}
                  onPress={(e) => {
                    e.stopPropagation();
                  }}
                >
                  {selectedMethod === 'unequal' && (
                    <Text style={styles.currencySymbol}>$</Text>
                  )}
                  <TextInput
                    style={styles.shareInput}
                    value={memberShares[item.id]}
                    onChangeText={(value) => updateShare(item.id, value)}
                    keyboardType="decimal-pad"
                    placeholder={selectedMethod === 'unequal' ? '0.00' : '0'}
                    onFocus={() => setFocusedId(item.id)}
                    onBlur={() => setFocusedId(null)}
                    returnKeyType="done"
                    onSubmitEditing={Keyboard.dismiss}
                  />
                  {selectedMethod === 'percent' && (
                    <Text style={styles.percentSymbol}>%</Text>
                  )}
                </Pressable>
              )}

              {selectedMembers[item.id] && selectedMethod === 'equal' && (
                <Text style={styles.equalShare}>
                  ${memberShares[item.id] || '0.00'}
                </Text>
              )}
            </Pressable>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mainContent: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  saveButton: {
    padding: 8,
  },
  saveButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  tabs: {
    flexDirection: 'row',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    gap: 8,
  },
  selectedTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    color: '#666',
  },
  selectedTabText: {
    color: colors.primary,
    fontWeight: '500',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    gap: 8,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 8,
    height: 36,
    borderRadius: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    padding: 0,
  },
  remainingContainer: {
    alignItems: 'center',
    minWidth: 80,
  },
  remainingText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  remainingLabel: {
    fontSize: 12,
    color: '#666',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 12,
  },
  memberItem: {
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#fff',
  },
  selectedMemberItem: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '08',
  },
  focusedMemberItem: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '05',
  },
  memberContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  memberLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  memberAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  memberInitial: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  memberName: {
    fontSize: 16,
    color: '#333',
  },
  selectedMemberName: {
    color: colors.primary,
    fontWeight: '500',
  },
  shareInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginTop: 12,
    height: 48,
  },
  shareInput: {
    flex: 1,
    fontSize: 16,
    textAlign: 'right',
    color: colors.primary,
    paddingVertical: 8,
    minWidth: 80,
  },
  currencySymbol: {
    fontSize: 16,
    color: '#666',
    marginRight: 8,
    width: 15,
  },
  percentSymbol: {
    fontSize: 16,
    color: '#666',
    marginLeft: 8,
    width: 15,
  },
  equalShare: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.primary,
    marginTop: 8,
    textAlign: 'right',
  },
}); 