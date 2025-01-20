import { View, Text, StyleSheet, FlatList, Pressable, TextInput } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { colors } from '../util/constant';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SelectPayer() {
  const router = useRouter();
  const { groupId } = useLocalSearchParams();
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState(1); // Default to 'You'

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

  const filteredMembers = groupMembers.filter(member =>
    member.name.toLowerCase().includes(search.toLowerCase())
  );

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
          <Text style={styles.headerTitle}>Who paid?</Text>
        </View>
        <Pressable 
          style={styles.doneButton}
          onPress={() => {
            const selectedMember = groupMembers.find(m => m.id === selectedId);
            router.back({
              params: { payerId: selectedMember.id, payerName: selectedMember.name }
            });
          }}
        >
          <Text style={styles.doneButtonText}>Done</Text>
        </Pressable>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search members..."
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <FlatList
        data={filteredMembers}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <Pressable
            style={[
              styles.memberItem,
              selectedId === item.id && styles.selectedMemberItem
            ]}
            onPress={() => setSelectedId(item.id)}
          >
            <View style={styles.memberLeft}>
              <View style={[styles.memberAvatar, { backgroundColor: colors.primary + '20' }]}>
                <Text style={styles.memberInitial}>{item.name.charAt(0)}</Text>
              </View>
              <Text style={[
                styles.memberName,
                selectedId === item.id && styles.selectedMemberName
              ]}>{item.name}</Text>
            </View>
            {selectedId === item.id && (
              <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
            )}
          </Pressable>
        )}
        contentContainerStyle={styles.listContent}
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
  doneButton: {
    padding: 8,
  },
  doneButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    margin: 8,
    padding: 8,
    borderRadius: 8,
    height: 40,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    padding: 0,
  },
  listContent: {
    padding: 8,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedMemberItem: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
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
  },
  selectedMemberName: {
    color: colors.primary,
    fontWeight: '500',
  },
}); 