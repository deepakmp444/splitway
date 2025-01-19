import { View, Text, StyleSheet, FlatList, Pressable, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../util/constant';
import { useState, useMemo } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

// Mock data moved to top
const groups = [
  {
    id: '1',
    name: 'Weekend Trip',
    totalSpent: 1200,
    summary: {
      youLent: 450,
      youBorrowed: 330,
      yourSpent: 400,
      yourBalance: 120
    },
    members: [
      { id: 'm1', name: 'You', spent: 400, balance: 120 },
      { id: 'm2', name: 'John', spent: 300, balance: -50 },
      { id: 'm3', name: 'Sarah', spent: 200, balance: -150 },
      { id: 'm4', name: 'Mike', spent: 150, balance: 100 },
      { id: 'm5', name: 'Emma', spent: 150, balance: -20 }
    ],
    recentActivity: '2 hours ago',
    status: 'active',
  },
  {
    id: '2',
    name: 'House Expenses',
    totalSpent: 2400,
    summary: {
      youLent: 600,
      youBorrowed: 645,
      yourSpent: 800,
      yourBalance: -45
    },
    members: [
      { id: 'm1', name: 'You', spent: 800, balance: -45 },
      { id: 'm2', name: 'Alex', spent: 900, balance: 200 },
      { id: 'm3', name: 'Lisa', spent: 700, balance: -155 }
    ],
    recentActivity: '1 day ago',
    status: 'active',
  },
  {
    id: '3',
    name: 'Movie Night',
    totalSpent: 240,
    summary: {
      youLent: 160,
      youBorrowed: 0,
      yourSpent: 80,
      yourBalance: 80
    },
    members: [
      { id: 'm1', name: 'You', spent: 80, balance: 80 },
      { id: 'm2', name: 'Tom', spent: 60, balance: -40 },
      { id: 'm3', name: 'Kate', spent: 50, balance: -20 },
      { id: 'm4', name: 'David', spent: 50, balance: -20 }
    ],
    recentActivity: '2 days ago',
    status: 'active',
  },
  {
    id: '4',
    name: 'Grocery Split',
    totalSpent: 350,
    summary: {
      youLent: 0,
      youBorrowed: 75,
      yourSpent: 50,
      yourBalance: -75
    },
    members: [
      { id: 'm1', name: 'You', spent: 50, balance: -75 },
      { id: 'm2', name: 'Ryan', spent: 200, balance: 125 },
      { id: 'm3', name: 'Sophie', spent: 100, balance: -50 }
    ],
    recentActivity: '3 days ago',
    status: 'settled',
  }
];

export default function Groups() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredGroups = useMemo(() => {
    if (!searchQuery.trim()) return groups;
    const query = searchQuery.toLowerCase().trim();
    return groups.filter(group => group.name.toLowerCase().includes(query));
  }, [searchQuery]);

  const renderGroupCard = ({ item }) => (
    <Pressable 
      style={styles.groupCard}
      onPress={() => router.push(`/groups/${item.id}`)}
    >
      <View style={styles.groupHeader}>
        <View style={styles.groupTitleContainer}>
          <Text style={styles.groupName}>{item.name}</Text>
          <View style={[
            styles.statusBadge, 
            { backgroundColor: item.status === 'active' ? '#38b00015' : '#66666615' }
          ]}>
            <Text style={[
              styles.statusText,
              { color: item.status === 'active' ? '#38b000' : '#666' }
            ]}>
              {item.status}
            </Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={24} color="#666" />
      </View>

      <View style={styles.groupStats}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Total Spent</Text>
          <Text style={styles.statValue}>${item.totalSpent}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>You Spent</Text>
          <Text style={styles.statValue}>${item.summary.yourSpent}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Your Balance</Text>
          <Text style={[
            styles.statValue,
            { color: item.summary.yourBalance >= 0 ? '#38b000' : '#ff0000' }
          ]}>
            {item.summary.yourBalance >= 0 ? '+' : '-'}${Math.abs(item.summary.yourBalance)}
          </Text>
        </View>
      </View>

      <View style={styles.detailStats}>
        <View style={styles.detailRow}>
          <Ionicons name="arrow-up" size={16} color="#38b000" />
          <Text style={styles.detailLabel}>You Lent:</Text>
          <Text style={[styles.detailValue, { color: '#38b000' }]}>
            ${item.summary.youLent}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="arrow-down" size={16} color="#ff0000" />
          <Text style={styles.detailLabel}>You Borrowed:</Text>
          <Text style={[styles.detailValue, { color: '#ff0000' }]}>
            ${item.summary.youBorrowed}
          </Text>
        </View>
      </View>

      <View style={styles.groupFooter}>
        <View style={styles.memberAvatars}>
          {item.members.slice(0, 3).map((member, index) => (
            <View 
              key={member.id} 
              style={[
                styles.avatar,
                { marginLeft: index > 0 ? -10 : 0 }
              ]}
            />
          ))}
          {item.members.length > 3 && (
            <View style={[styles.avatar, styles.avatarMore]}>
              <Text style={styles.avatarMoreText}>+{item.members.length - 3}</Text>
            </View>
          )}
        </View>
        <Text style={styles.lastActivity}>Active {item.recentActivity}</Text>
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Groups</Text>
        <Pressable 
          style={styles.createButton}
          onPress={() => router.push('/groups/create-group')}
        >
          <Ionicons name="add" size={24} color="white" />
        </Pressable>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search groups..."
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

      <FlatList
        data={filteredGroups}
        renderItem={renderGroupCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No groups found</Text>
          </View>
        )}
      />
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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
  },
  createButton: {
    backgroundColor: colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginVertical: 8,
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
  listContainer: {
    padding: 16,
    gap: 16,
  },
  groupCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  groupTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  groupName: {
    fontSize: 18,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  groupStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  groupFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  memberAvatars: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary + '40',
    borderWidth: 2,
    borderColor: 'white',
  },
  avatarMore: {
    backgroundColor: '#E5E5E5',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -10,
  },
  avatarMoreText: {
    fontSize: 12,
    color: '#666',
  },
  lastActivity: {
    fontSize: 12,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  detailStats: {
    marginTop: 8,
    marginBottom: 16,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
    marginRight: 8,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
  },
}); 