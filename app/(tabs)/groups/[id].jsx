import { View, Text, StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// Mock expenses data
const mockExpenses = [
  { id: '1', title: 'Dinner at Italian Restaurant', amount: 120.50, date: '2024-03-15', category: 'food', paidBy: 'John Smith', icon: 'restaurant' },
  { id: '2', title: 'Movie Tickets', amount: 45.00, date: '2024-03-14', category: 'entertainment', paidBy: 'Emma Wilson', icon: 'film' },
  { id: '3', title: 'Grocery Shopping', amount: 89.75, date: '2024-03-13', category: 'groceries', paidBy: 'Michael Brown', icon: 'cart' },
  { id: '4', title: 'Uber Ride', amount: 25.30, date: '2024-03-12', category: 'transport', paidBy: 'Sarah Davis', icon: 'car' },
  { id: '5', title: 'Netflix Subscription', amount: 15.99, date: '2024-03-11', category: 'entertainment', paidBy: 'John Smith', icon: 'tv' },
  { id: '6', title: 'Pizza Night', amount: 55.00, date: '2024-03-10', category: 'food', paidBy: 'Emma Wilson', icon: 'pizza' },
  { id: '7', title: 'Gas Bill', amount: 80.25, date: '2024-03-09', category: 'utilities', paidBy: 'Michael Brown', icon: 'flame' },
  { id: '8', title: 'Amazon Purchase', amount: 150.99, date: '2024-03-08', category: 'shopping', paidBy: 'Sarah Davis', icon: 'cart' },
  { id: '9', title: 'Gym Membership', amount: 60.00, date: '2024-03-07', category: 'fitness', paidBy: 'John Smith', icon: 'barbell' },
  { id: '10', title: 'Coffee Run', amount: 28.50, date: '2024-03-06', category: 'food', paidBy: 'Emma Wilson', icon: 'cafe' },
  { id: '11', title: 'Internet Bill', amount: 75.00, date: '2024-03-05', category: 'utilities', paidBy: 'Michael Brown', icon: 'wifi' },
  { id: '12', title: 'Concert Tickets', amount: 180.00, date: '2024-03-04', category: 'entertainment', paidBy: 'Sarah Davis', icon: 'musical-notes' },
  { id: '13', title: 'House Cleaning', amount: 100.00, date: '2024-03-03', category: 'services', paidBy: 'John Smith', icon: 'home' },
  { id: '14', title: 'Birthday Gift', amount: 50.00, date: '2024-03-02', category: 'shopping', paidBy: 'Emma Wilson', icon: 'gift' },
  { id: '15', title: 'Pharmacy', amount: 35.80, date: '2024-03-01', category: 'health', paidBy: 'Michael Brown', icon: 'medical' },
  { id: '16', title: 'Parking Fee', amount: 15.00, date: '2024-02-29', category: 'transport', paidBy: 'Sarah Davis', icon: 'car' },
  { id: '17', title: 'Phone Bill', amount: 65.99, date: '2024-02-28', category: 'utilities', paidBy: 'John Smith', icon: 'phone-portrait' },
  { id: '18', title: 'Lunch Meeting', amount: 95.50, date: '2024-02-27', category: 'food', paidBy: 'Emma Wilson', icon: 'restaurant' },
  { id: '19', title: 'Sports Equipment', amount: 200.00, date: '2024-02-26', category: 'shopping', paidBy: 'Michael Brown', icon: 'basketball' },
  { id: '20', title: 'Hotel Booking', amount: 350.00, date: '2024-02-25', category: 'travel', paidBy: 'Sarah Davis', icon: 'bed' }
];

export default function GroupDetails() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  // Calculate totals
  const totalExpenses = mockExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const averagePerPerson = totalExpenses / 4; // Assuming 4 members

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatAmount = (amount) => {
    return `$${amount.toFixed(2)}`;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="black" />
          </Pressable>
          <View style={styles.groupInfo}>
            <Image 
              source={{ uri: 'https://picsum.photos/200' }}
              style={styles.groupImage}
            />
            <View style={styles.groupDetails}>
              <Text style={styles.groupName}>Weekend Trip</Text>
              <Text style={styles.groupMembers}>4 members</Text>
            </View>
          </View>
          <Pressable style={styles.exportButton} onPress={() => console.log('Export')}>
            <Ionicons name="share-outline" size={24} color="black" />
          </Pressable>
        </View>
        
        <View style={styles.balanceCard}>
          <View style={styles.balanceRow}>
            <View style={styles.balanceItem}>
              <Text style={styles.balanceLabel}>Total Expenses</Text>
              <Text style={styles.balanceAmount}>{formatAmount(totalExpenses)}</Text>
            </View>
            <View style={styles.balanceItem}>
              <Text style={styles.balanceLabel}>Your Share</Text>
              <Text style={styles.balanceAmount}>{formatAmount(averagePerPerson)}</Text>
            </View>
          </View>
          <Pressable style={styles.settleButton} onPress={() => console.log('Settle up')}>
            <Text style={styles.settleButtonText}>Settle Up</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {mockExpenses.map(expense => (
          <Pressable 
            key={expense.id}
            style={styles.expenseCard}
            onPress={() => console.log('View expense details', expense.id)}
          >
            <View style={styles.expenseIcon}>
              <Ionicons name={expense.icon} size={24} color="#666" />
            </View>
            <View style={styles.expenseInfo}>
              <Text style={styles.expenseTitle}>{expense.title}</Text>
              <Text style={styles.expenseDetails}>
                Paid by {expense.paidBy} • {formatDate(expense.date)}
              </Text>
            </View>
            <Text style={styles.expenseAmount}>{formatAmount(expense.amount)}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <Pressable 
          style={styles.addButton}
          onPress={() => console.log('Add expense')}
        >
          <Ionicons name="add" size={24} color="white" />
          <Text style={styles.addButtonText}>Add Expense</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
  },
  groupInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 8,
  },
  groupImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  groupDetails: {
    flex: 1,
  },
  groupName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  groupMembers: {
    fontSize: 13,
    color: '#666',
  },
  exportButton: {
    padding: 8,
  },
  balanceCard: {
    margin: 16,
    padding: 16,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    gap: 16,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  balanceItem: {
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
  },
  settleButton: {
    backgroundColor: '#000',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  settleButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  expenseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  expenseIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  expenseInfo: {
    flex: 1,
  },
  expenseTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    marginBottom: 4,
  },
  expenseDetails: {
    fontSize: 13,
    color: '#666',
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginLeft: 12,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  addButton: {
    backgroundColor: '#000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
}); 