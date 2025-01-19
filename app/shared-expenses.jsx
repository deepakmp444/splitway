import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../util/constant';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SharedExpenses() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Mock data for shared expenses
  const expenses = [
    {
      id: 'e1',
      description: 'Dinner at Italian Restaurant',
      amount: 90,
      date: '2024-03-25',
      split: 'equal',
      paidBy: 'user',
      category: 'food'
    },
    {
      id: 'e2',
      description: 'Movie Tickets',
      amount: 30,
      date: '2024-03-24',
      split: 'equal',
      paidBy: params.name,
      category: 'entertainment'
    },
    {
      id: 'e3',
      description: 'Grocery Shopping',
      amount: 75,
      date: '2024-03-23',
      split: 'equal',
      paidBy: 'user',
      category: 'groceries'
    }
  ];

  const renderExpense = ({ item }) => (
    <Pressable 
      style={styles.expenseCard}
      onPress={() => console.log('View expense details:', item.id)}
    >
      <View style={styles.expenseLeft}>
        <View style={[styles.categoryIcon, { backgroundColor: `${colors.primary}15` }]}>
          <Ionicons 
            name={
              item.category === 'food' ? 'restaurant' :
              item.category === 'entertainment' ? 'film' :
              'cart'
            } 
            size={24} 
            color={colors.primary} 
          />
        </View>
        <View style={styles.expenseInfo}>
          <Text style={styles.expenseDescription}>{item.description}</Text>
          <Text style={styles.expenseDate}>{new Date(item.date).toLocaleDateString()}</Text>
        </View>
      </View>
      <View style={styles.expenseRight}>
        <Text style={[
          styles.expenseAmount,
          { color: item.paidBy === 'user' ? '#38b000' : '#ff0000' }
        ]}>
          {item.paidBy === 'user' ? '+' : '-'}${item.amount / 2}
        </Text>
        <Text style={styles.paidBy}>
          {item.paidBy === 'user' ? 'You paid' : `${params.name} paid`}
        </Text>
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
        <Text style={styles.title}>Shared Expenses</Text>
      </View>

      <View style={styles.statsCard}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Total Shared</Text>
          <Text style={styles.statValue}>$195</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Your Share</Text>
          <Text style={styles.statValue}>$97.50</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Balance</Text>
          <Text style={[styles.statValue, { color: '#38b000' }]}>+$45</Text>
        </View>
      </View>

      <FlatList
        data={expenses}
        renderItem={renderExpense}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.expensesList}
        showsVerticalScrollIndicator={false}
      />

      <Pressable 
        style={styles.addButton}
        onPress={() => console.log('Add new expense')}
      >
        <Ionicons name="add" size={24} color="white" />
        <Text style={styles.addButtonText}>Add Expense</Text>
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
  statsCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    marginBottom: 8,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E5E5E5',
  },
  expensesList: {
    padding: 16,
    gap: 12,
  },
  expenseCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  expenseLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  categoryIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  expenseInfo: {
    flex: 1,
  },
  expenseDescription: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  expenseDate: {
    fontSize: 13,
    color: '#666',
  },
  expenseRight: {
    alignItems: 'flex-end',
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  paidBy: {
    fontSize: 13,
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