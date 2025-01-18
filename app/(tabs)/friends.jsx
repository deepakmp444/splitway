import { View, Text, StyleSheet, FlatList, TextInput, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../util/constant';
import { useState, useMemo } from 'react';
import { Image } from 'expo-image';

export default function Friends() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('all'); // 'all', 'requests', 'blocked'

  const friends = [
    {
      id: 'f1',
      name: 'John Doe',
      username: '@johndoe',
      totalSharedGroups: 3,
      totalTransactions: 12,
      balance: 120,
      status: 'active',
      avatar: 'https://picsum.photos/200',
    },
    {
      id: 'f2',
      name: 'Sarah Smith',
      username: '@sarahs',
      totalSharedGroups: 2,
      totalTransactions: 8,
      balance: -45,
      status: 'active',
      avatar: 'https://picsum.photos/201',
    },
    {
      id: 'f3',
      name: 'Mike Johnson',
      username: '@mikej',
      totalSharedGroups: 1,
      totalTransactions: 5,
      balance: 0,
      status: 'active',
      avatar: 'https://picsum.photos/202',
    }
  ];

  const friendRequests = [
    {
      id: 'r1',
      name: 'Emma Wilson',
      username: '@emmaw',
      mutualFriends: 3,
      avatar: 'https://picsum.photos/203',
    },
    {
      id: 'r2',
      name: 'Alex Brown',
      username: '@alexb',
      mutualFriends: 1,
      avatar: 'https://picsum.photos/204',
    }
  ];

  const filteredFriends = useMemo(() => {
    if (!searchQuery.trim()) {
      return selectedTab === 'requests' ? friendRequests : friends;
    }
    
    const query = searchQuery.toLowerCase().trim();
    const dataToSearch = selectedTab === 'requests' ? friendRequests : friends;
    
    return dataToSearch.filter(friend => 
      friend.name.toLowerCase().includes(query) || 
      friend.username.toLowerCase().includes(query)
    );
  }, [searchQuery, selectedTab]);

  const renderFriendCard = ({ item }) => (
    <Pressable style={styles.friendCard}>
      <View style={styles.friendInfo}>
        <Image
          source={item.avatar}
          style={styles.avatar}
          contentFit="cover"
          transition={1000}
        />
        <View style={styles.friendDetails}>
          <Text style={styles.friendName}>{item.name}</Text>
          <Text style={styles.username}>{item.username}</Text>
        </View>
      </View>

      {selectedTab === 'requests' ? (
        <View style={styles.requestActions}>
          <Text style={styles.mutualText}>{item.mutualFriends} mutual friends</Text>
          <View style={styles.actionButtons}>
            <Pressable style={[styles.actionButton, styles.acceptButton]}>
              <Text style={styles.actionButtonText}>Accept</Text>
            </Pressable>
            <Pressable style={[styles.actionButton, styles.declineButton]}>
              <Text style={[styles.actionButtonText, { color: '#666' }]}>Decline</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <View style={styles.friendStats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{item.totalSharedGroups}</Text>
            <Text style={styles.statLabel}>Groups</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{item.totalTransactions}</Text>
            <Text style={styles.statLabel}>Transactions</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[
              styles.statValue,
              { color: item.balance > 0 ? '#38b000' : item.balance < 0 ? '#ff0000' : '#666' }
            ]}>
              {item.balance > 0 ? '+' : item.balance < 0 ? '-' : ''}
              ${Math.abs(item.balance)}
            </Text>
            <Text style={styles.statLabel}>Balance</Text>
          </View>
        </View>
      )}
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Friends</Text>
        <Pressable style={styles.addButton}>
          <Ionicons name="person-add" size={24} color="white" />
        </Pressable>
      </View>

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

      <View style={styles.tabs}>
        <Pressable 
          style={[styles.tab, selectedTab === 'all' && styles.activeTab]}
          onPress={() => setSelectedTab('all')}
        >
          <Text style={[styles.tabText, selectedTab === 'all' && styles.activeTabText]}>
            All Friends ({friends.length})
          </Text>
        </Pressable>
        <Pressable 
          style={[styles.tab, selectedTab === 'requests' && styles.activeTab]}
          onPress={() => setSelectedTab('requests')}
        >
          <Text style={[styles.tabText, selectedTab === 'requests' && styles.activeTabText]}>
            Requests ({friendRequests.length})
          </Text>
        </Pressable>
      </View>

      <FlatList
        data={filteredFriends}
        renderItem={renderFriendCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {selectedTab === 'requests' ? 'No friend requests' : 'No friends found'}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9faf9',
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
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
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
  tabs: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#E5E5E5',
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: colors.primary,
  },
  tabText: {
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: 'white',
  },
  listContainer: {
    padding: 16,
    gap: 12,
  },
  friendCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  friendInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  friendDetails: {
    flex: 1,
  },
  friendName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  username: {
    fontSize: 14,
    color: '#666',
  },
  friendStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E5E5E5',
  },
  requestActions: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  mutualText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  acceptButton: {
    backgroundColor: colors.primary,
  },
  declineButton: {
    backgroundColor: '#E5E5E5',
  },
  actionButtonText: {
    color: 'white',
    fontWeight: '500',
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
}); 