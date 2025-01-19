import { View, Text, StyleSheet, FlatList, TextInput, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../util/constant';
import { useState, useMemo } from 'react';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';

export default function Friends() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('all'); // 'all', 'requests', 'pending'
  const router = useRouter();

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

  const pendingRequests = [
    {
      id: 'p1',
      name: 'David Lee',
      username: '@davidl',
      requestedAt: '2024-03-25T10:30:00Z',
      avatar: 'https://picsum.photos/205',
    },
    {
      id: 'p2',
      name: 'Lisa Park',
      username: '@lisap',
      requestedAt: '2024-03-25T09:15:00Z',
      avatar: 'https://picsum.photos/206',
    }
  ];

  const filteredFriends = useMemo(() => {
    if (!searchQuery.trim()) {
      if (selectedTab === 'requests') return friendRequests;
      if (selectedTab === 'pending') return pendingRequests;
      return friends;
    }
    
    const query = searchQuery.toLowerCase().trim();
    let dataToSearch = friends;
    
    if (selectedTab === 'requests') dataToSearch = friendRequests;
    if (selectedTab === 'pending') dataToSearch = pendingRequests;
    
    return dataToSearch.filter(friend => 
      friend.name.toLowerCase().includes(query) || 
      friend.username.toLowerCase().includes(query)
    );
  }, [searchQuery, selectedTab]);

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return 'Just now';
  };

  const renderFriendCard = ({ item }) => {
    if (selectedTab === 'pending') {
      return (
        <Pressable 
          style={styles.friendCard}
          onPress={() => router.push({
            pathname: '/chat',
            params: {
              id: item.id,
              name: item.name,
              username: item.username,
              avatar: item.avatar,
              balance: item.balance
            }
          })}
        >
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
              <Text style={styles.timestamp}>Requested {formatTimestamp(item.requestedAt)}</Text>
            </View>
          </View>
          <View style={styles.requestActions}>
            <Pressable 
              style={[styles.actionButton, styles.cancelButton]}
              onPress={() => console.log('Cancel request:', item.id)}
            >
              <Text style={[styles.actionButtonText, { color: '#ff0000' }]}>Cancel Request</Text>
            </Pressable>
          </View>
        </Pressable>
      );
    }

    if (selectedTab === 'requests') {
      return (
        <Pressable 
          style={styles.friendCard}
          onPress={() => router.push({
            pathname: '/chat',
            params: {
              id: item.id,
              name: item.name,
              username: item.username,
              avatar: item.avatar,
              balance: item.balance
            }
          })}
        >
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
              <Text style={styles.mutualText}>{item.mutualFriends} mutual friends</Text>
            </View>
          </View>
          <View style={styles.requestActions}>
            <View style={styles.actionButtons}>
              <Pressable style={[styles.actionButton, styles.acceptButton]}>
                <Text style={styles.actionButtonText}>Accept</Text>
              </Pressable>
              <Pressable style={[styles.actionButton, styles.declineButton]}>
                <Text style={[styles.actionButtonText, { color: '#666' }]}>Decline</Text>
              </Pressable>
            </View>
          </View>
        </Pressable>
      );
    }

    return (
      <Pressable 
        style={styles.friendCard}
        onPress={() => router.push({
          pathname: '/chat',
          params: {
            id: item.id,
            name: item.name,
            username: item.username,
            avatar: item.avatar,
            balance: item.balance
          }
        })}
      >
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
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Friends</Text>
        <Pressable 
          style={styles.addButton}
          onPress={() => router.push('/add-friend')}
        >
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

      <View style={styles.tabsContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabs}
        >
          <Pressable 
            style={[styles.tab, selectedTab === 'all' && styles.activeTab]}
            onPress={() => setSelectedTab('all')}
          >
            <Text style={[styles.tabText, selectedTab === 'all' && styles.activeTabText]}>
              All Friends
            </Text>
            <View style={[styles.badge, selectedTab === 'all' && styles.activeBadge]}>
              <Text style={[styles.badgeText, selectedTab === 'all' && styles.activeBadgeText]}>
                {friends.length}
              </Text>
            </View>
          </Pressable>
          <Pressable 
            style={[styles.tab, selectedTab === 'requests' && styles.activeTab]}
            onPress={() => setSelectedTab('requests')}
          >
            <Text style={[styles.tabText, selectedTab === 'requests' && styles.activeTabText]}>
              Requests
            </Text>
            <View style={[styles.badge, selectedTab === 'requests' && styles.activeBadge]}>
              <Text style={[styles.badgeText, selectedTab === 'requests' && styles.activeBadgeText]}>
                {friendRequests.length}
              </Text>
            </View>
          </Pressable>
          <Pressable 
            style={[styles.tab, selectedTab === 'pending' && styles.activeTab]}
            onPress={() => setSelectedTab('pending')}
          >
            <Text style={[styles.tabText, selectedTab === 'pending' && styles.activeTabText]}>
              Pending
            </Text>
            <View style={[styles.badge, selectedTab === 'pending' && styles.activeBadge]}>
              <Text style={[styles.badgeText, selectedTab === 'pending' && styles.activeBadgeText]}>
                {pendingRequests.length}
              </Text>
            </View>
          </Pressable>
        </ScrollView>
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
              {selectedTab === 'requests' ? 'No friend requests' : 
               selectedTab === 'pending' ? 'No pending requests' : 
               'No friends found'}
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
  tabsContainer: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 24,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 8,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: colors.primary,
  },
  tabText: {
    color: '#666',
    fontWeight: '500',
    fontSize: 15,
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: '600',
  },
  badge: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
    minWidth: 24,
    alignItems: 'center',
  },
  activeBadge: {
    backgroundColor: `${colors.primary}15`,
  },
  badgeText: {
    color: '#666',
    fontSize: 12,
    fontWeight: '500',
  },
  activeBadgeText: {
    color: colors.primary,
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
    marginBottom: 2,
  },
  timestamp: {
    fontSize: 12,
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
  cancelButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ff0000',
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