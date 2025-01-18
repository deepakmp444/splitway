import { View, Text, StyleSheet, FlatList, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../util/constant';
import { useState, useMemo } from 'react';

export default function Activity() {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data - replace with your actual data
  const activities = [
    {
      id: '1',
      type: 'MONEY',
      action: 'LENT',
      amount: 50,
      user: 'John Doe',
      group: 'Weekend Trip',
      timestamp: '2024-03-24T10:30:00',
    },
    {
      id: '2',
      type: 'GROUP',
      action: 'CREATE',
      user: 'You',
      group: 'House Expenses',
      timestamp: '2024-03-24T09:15:00',
    },
    {
      id: '3',
      type: 'MONEY',
      action: 'BORROWED',
      amount: 25,
      user: 'Sarah Smith',
      group: 'Lunch Group',
      timestamp: '2024-03-24T08:20:00',
    },
    {
      id: '4',
      type: 'FRIEND',
      action: 'ADD',
      user: 'Mike Johnson',
      timestamp: '2024-03-23T18:20:00',
    },
    {
      id: '5',
      type: 'GROUP',
      action: 'JOIN',
      user: 'Emma Wilson',
      group: 'Weekend Trip',
      timestamp: '2024-03-23T17:45:00',
    },
    {
      id: '6',
      type: 'MONEY',
      action: 'SETTLED',
      amount: 75,
      user: 'Alex Brown',
      group: 'Movie Night',
      timestamp: '2024-03-23T16:30:00',
    },
    {
      id: '7',
      type: 'GROUP',
      action: 'LEAVE',
      user: 'David Lee',
      group: 'Gym Buddies',
      timestamp: '2024-03-23T15:20:00',
    },
    {
      id: '8',
      type: 'MONEY',
      action: 'LENT',
      amount: 120,
      user: 'Sophie Chen',
      group: 'Shopping Split',
      timestamp: '2024-03-23T14:10:00',
    },
    {
      id: '9',
      type: 'FRIEND',
      action: 'REMOVE',
      user: 'Tom Wilson',
      timestamp: '2024-03-23T13:05:00',
    },
    {
      id: '10',
      type: 'GROUP',
      action: 'EDIT',
      user: 'You',
      group: 'Weekend Trip',
      timestamp: '2024-03-23T12:30:00',
    },
    {
      id: '11',
      type: 'MONEY',
      action: 'BORROWED',
      amount: 45,
      user: 'Lisa Park',
      group: 'Dinner Squad',
      timestamp: '2024-03-23T11:20:00',
    },
    {
      id: '12',
      type: 'GROUP',
      action: 'JOIN',
      user: 'James Miller',
      group: 'Travel Fund',
      timestamp: '2024-03-23T10:15:00',
    },
    {
      id: '13',
      type: 'FRIEND',
      action: 'ADD',
      user: 'Emily Davis',
      timestamp: '2024-03-22T22:40:00',
    },
    {
      id: '14',
      type: 'MONEY',
      action: 'SETTLED',
      amount: 200,
      user: 'Ryan White',
      group: 'Rent Split',
      timestamp: '2024-03-22T21:30:00',
    },
    {
      id: '15',
      type: 'GROUP',
      action: 'CREATE',
      user: 'You',
      group: 'Birthday Party',
      timestamp: '2024-03-22T20:25:00',
    },
    {
      id: '16',
      type: 'MONEY',
      action: 'LENT',
      amount: 15,
      user: 'Chris Taylor',
      group: 'Coffee Run',
      timestamp: '2024-03-22T19:15:00',
    },
    {
      id: '17',
      type: 'GROUP',
      action: 'EDIT',
      user: 'Maria Garcia',
      group: 'Vacation 2024',
      timestamp: '2024-03-22T18:10:00',
    },
    {
      id: '18',
      type: 'FRIEND',
      action: 'ADD',
      user: 'Kevin Martinez',
      timestamp: '2024-03-22T17:05:00',
    },
    {
      id: '19',
      type: 'MONEY',
      action: 'BORROWED',
      amount: 80,
      user: 'Anna Kim',
      group: 'Grocery Split',
      timestamp: '2024-03-22T16:00:00',
    },
    {
      id: '20',
      type: 'GROUP',
      action: 'LEAVE',
      user: 'Daniel Wong',
      group: 'Game Night',
      timestamp: '2024-03-22T15:45:00',
    }
  ];

  // Filter activities based on search query
  const filteredActivities = useMemo(() => {
    if (!searchQuery.trim()) return activities;
    
    const query = searchQuery.toLowerCase().trim();
    return activities.filter(activity => {
      // Search in user names
      if (activity.user.toLowerCase().includes(query)) return true;
      
      // Search in group names (if exists)
      if (activity.group && activity.group.toLowerCase().includes(query)) return true;
      
      // Search in activity type and action
      if (activity.type.toLowerCase().includes(query)) return true;
      if (activity.action.toLowerCase().includes(query)) return true;
      
      // Search in amount (if exists)
      if (activity.amount && activity.amount.toString().includes(query)) return true;
      
      return false;
    });
  }, [searchQuery]);

  const getActivityIcon = (type, action) => {
    switch (type) {
      case 'MONEY':
        if (action === 'SETTLED') return 'checkmark-circle';
        return action === 'LENT' ? 'arrow-up' : 'arrow-down';
      case 'GROUP':
        switch (action) {
          case 'CREATE': return 'add-circle';
          case 'EDIT': return 'create';
          case 'LEAVE': return 'exit';
          default: return 'people';
        }
      case 'FRIEND':
        return action === 'ADD' ? 'person-add' : 'person-remove';
      default:
        return 'notifications';
    }
  };

  const getActivityColor = (type, action) => {
    switch (type) {
      case 'MONEY':
        return action === 'LENT' ? '#38b000' : '#ff0000';
      case 'GROUP':
        return colors.primary;
      case 'FRIEND':
        return '#9747FF';
      default:
        return '#666';
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getActivityDescription = (activity) => {
    switch (activity.type) {
      case 'MONEY':
        if (activity.action === 'SETTLED')
          return `Settled $${activity.amount} with ${activity.user} in ${activity.group}`;
        return `${activity.action === 'LENT' ? 'Lent' : 'Borrowed'} $${activity.amount} ${activity.action === 'LENT' ? 'to' : 'from'} ${activity.user} in ${activity.group}`;
      case 'GROUP':
        switch (activity.action) {
          case 'CREATE':
            return `${activity.user} created group ${activity.group}`;
          case 'EDIT':
            return `${activity.user} edited group ${activity.group}`;
          case 'LEAVE':
            return `${activity.user} left group ${activity.group}`;
          default:
            return `${activity.user} joined ${activity.group}`;
        }
      case 'FRIEND':
        return `${activity.user} was ${activity.action.toLowerCase()}ed ${activity.action === 'ADD' ? 'as friend' : 'from friends'}`;
      default:
        return '';
    }
  };

  const renderActivity = ({ item }) => (
    <View style={styles.activityCard}>
      <View style={[styles.iconContainer, { backgroundColor: `${getActivityColor(item.type, item.action)}15` }]}>
        <Ionicons
          name={getActivityIcon(item.type, item.action)}
          size={24}
          color={getActivityColor(item.type, item.action)}
        />
      </View>
      <View style={styles.activityContent}>
        <Text style={styles.activityText}>
          {getActivityDescription(item)}
        </Text>
        <Text style={styles.timestamp}>{formatTimestamp(item.timestamp)}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Activity</Text>
      </View>
      
      {/* Add Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search activities..."
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
        data={filteredActivities}
        renderItem={renderActivity}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No activities found</Text>
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
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 16,
    gap: 12,
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 16,
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 14,
    color: '#666',
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