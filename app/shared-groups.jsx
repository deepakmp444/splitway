import { View, Text, StyleSheet, FlatList, Pressable, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../util/constant';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SharedGroups() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Mock data for shared groups
  const groups = [
    {
      id: 'g1',
      name: 'Weekend Trip',
      members: 4,
      lastActivity: '2024-03-25T10:30:00Z',
      totalExpenses: 450,
      image: 'https://picsum.photos/200',
    },
    {
      id: 'g2',
      name: 'Roommates',
      members: 3,
      lastActivity: '2024-03-24T15:45:00Z',
      totalExpenses: 850,
      image: 'https://picsum.photos/201',
    },
    {
      id: 'g3',
      name: 'Dinner Club',
      members: 6,
      lastActivity: '2024-03-23T20:15:00Z',
      totalExpenses: 320,
      image: 'https://picsum.photos/202',
    }
  ];

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return 'Just now';
  };

  const renderGroup = ({ item }) => (
    <Pressable 
      style={styles.groupCard}
      onPress={() => router.push(`/groups/${item.id}`)}
    >
      <Image
        source={{ uri: item.image }}
        style={styles.groupImage}
      />
      <View style={styles.groupInfo}>
        <View style={styles.groupHeader}>
          <Text style={styles.groupName}>{item.name}</Text>
          <Text style={styles.groupMembers}>{item.members} members</Text>
        </View>
        <View style={styles.groupStats}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Total Expenses</Text>
            <Text style={styles.statValue}>${item.totalExpenses}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Last Activity</Text>
            <Text style={styles.statValue}>{formatTime(item.lastActivity)}</Text>
          </View>
        </View>
      </View>
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
        <Text style={styles.title}>Shared Groups</Text>
      </View>

      <FlatList
        data={groups}
        renderItem={renderGroup}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.groupsList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No shared groups yet</Text>
          </View>
        )}
      />

      <Pressable 
        style={styles.addButton}
        onPress={() => console.log('Create new group')}
      >
        <Ionicons name="add" size={24} color="white" />
        <Text style={styles.addButtonText}>Create Group</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9faf9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    padding: 4,
    marginRight: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  groupsList: {
    padding: 16,
    gap: 16,
  },
  groupCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    overflow: 'hidden',
  },
  groupImage: {
    width: '100%',
    height: 120,
  },
  groupInfo: {
    padding: 16,
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  groupName: {
    fontSize: 18,
    fontWeight: '600',
  },
  groupMembers: {
    fontSize: 14,
    color: '#666',
  },
  groupStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  addButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 24,
    gap: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
}); 