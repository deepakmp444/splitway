import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, FlatList, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { colors } from '../../../util/constant';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function GroupDetails() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState('expenses');
  const [message, setMessage] = useState('');

  // Mock data for the group
  const group = {
    id,
    name: 'Weekend Trip',
    image: null,
    totalExpenses: 1850.50,
    members: [
      { id: 1, name: 'You', spent: 500, balance: 150, avatar: null },
      { id: 2, name: 'John', spent: 450, balance: -100, avatar: null },
      { id: 3, name: 'Sarah', spent: 400, balance: -50, avatar: null },
      { id: 4, name: 'Mike', spent: 300, balance: 0, avatar: null },
    ],
    expenses: [
      { 
        id: 1, 
        description: 'Hotel Booking', 
        amount: 800, 
        paidBy: 'You', 
        date: '2024-01-15',
        splitBetween: ['You', 'John', 'Sarah', 'Mike'],
        category: 'Travel'
      },
      { 
        id: 2, 
        description: 'Dinner', 
        amount: 150, 
        paidBy: 'John', 
        date: '2024-01-15',
        splitBetween: ['You', 'John', 'Sarah'],
        category: 'Food'
      },
      { 
        id: 3, 
        description: 'Taxi', 
        amount: 50, 
        paidBy: 'Sarah', 
        date: '2024-01-16',
        splitBetween: ['You', 'Sarah', 'Mike'],
        category: 'Transport'
      },
    ],
    discussions: [
      { id: 1, user: 'John', message: 'When are we splitting the dinner bill?', time: '2 hours ago', avatar: null },
      { id: 2, user: 'Sarah', message: 'I\'ll transfer my part tonight', time: '1 hour ago', avatar: null },
      { id: 3, user: 'You', message: 'Thanks Sarah! Mike, what about you?', time: '30 mins ago', avatar: null },
      { id: 4, user: 'Mike', message: 'Will do it tomorrow morning', time: '15 mins ago', avatar: null },
    ]
  };

  const tabs = [
    { id: 'expenses', label: 'Expenses' },
    { id: 'balance', label: 'Balance' },
    { id: 'balances', label: 'Balances' },
    { id: 'discussion', label: 'Discussion' },
  ];

  const renderExpensesTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.expenseHeader}>
        <Text style={styles.expenseTitle}>Recent Expenses</Text>
        <Pressable 
          style={styles.addButton}
          onPress={() => {/* Add expense logic */}}
        >
          <Ionicons name="add" size={20} color="white" />
          <Text style={styles.addButtonText}>Add Expense</Text>
        </Pressable>
      </View>
      {group.expenses.map(expense => (
        <Pressable 
          key={expense.id} 
          style={styles.expenseCard}
          onPress={() => {/* View expense details */}}
        >
          <View style={styles.expenseMain}>
            <View style={styles.expenseLeft}>
              <View style={[styles.categoryIcon, { 
                backgroundColor: expense.category === 'Travel' ? '#E3F2FD' : 
                                expense.category === 'Food' ? '#FFF3E0' : '#E8F5E9'
              }]}>
                <Ionicons 
                  name={expense.category === 'Travel' ? 'airplane' : 
                        expense.category === 'Food' ? 'restaurant' : 'car'} 
                  size={20} 
                  color={expense.category === 'Travel' ? '#1976D2' : 
                         expense.category === 'Food' ? '#F57C00' : '#43A047'} 
                />
              </View>
              <View>
                <Text style={styles.expenseDescription}>{expense.description}</Text>
                <Text style={styles.expenseDate}>{expense.date}</Text>
              </View>
            </View>
            <View style={styles.expenseRight}>
              <Text style={styles.expenseAmount}>${expense.amount}</Text>
              <Text style={styles.expensePaidBy}>Paid by {expense.paidBy}</Text>
            </View>
          </View>
          <View style={styles.expenseSplit}>
            <Text style={styles.expenseSplitText}>
              Split with {expense.splitBetween.filter(m => m !== expense.paidBy).join(', ')}
            </Text>
          </View>
        </Pressable>
      ))}
    </View>
  );

  const renderBalanceTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.totalBalance}>
        <Text style={styles.totalBalanceLabel}>Total Group Expenses</Text>
        <Text style={styles.totalBalanceAmount}>${group.totalExpenses}</Text>
      </View>
      <View style={styles.balanceList}>
        {group.members.map(member => (
          <View key={member.id} style={styles.balanceItem}>
            <View style={styles.balanceLeft}>
              <View style={styles.memberAvatar}>
                <Ionicons name="person" size={20} color={colors.primary} />
              </View>
              <View>
                <Text style={styles.memberName}>{member.name}</Text>
                <Text style={styles.memberSpent}>Spent ${member.spent}</Text>
              </View>
            </View>
            <Text style={[
              styles.memberBalance,
              { color: member.balance >= 0 ? '#2E7D32' : '#D32F2F' }
            ]}>
              {member.balance >= 0 ? '+' : ''} ${Math.abs(member.balance)}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderBalancesTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.balanceStats}>
        <View style={styles.balanceStat}>
          <Text style={styles.balanceStatLabel}>You paid</Text>
          <Text style={styles.balanceStatAmount}>$500</Text>
        </View>
        <View style={styles.balanceStatDivider} />
        <View style={styles.balanceStat}>
          <Text style={styles.balanceStatLabel}>Your share</Text>
          <Text style={styles.balanceStatAmount}>$350</Text>
        </View>
        <View style={styles.balanceStatDivider} />
        <View style={styles.balanceStat}>
          <Text style={styles.balanceStatLabel}>You are owed</Text>
          <Text style={[styles.balanceStatAmount, { color: '#2E7D32' }]}>+$150</Text>
        </View>
      </View>
      <View style={styles.settleUpCard}>
        <Text style={styles.settleUpTitle}>Ready to settle up?</Text>
        <Text style={styles.settleUpDescription}>
          Clear all debts and start fresh with your group
        </Text>
        <Pressable style={styles.settleUpButton}>
          <Text style={styles.settleUpButtonText}>Settle Up</Text>
        </Pressable>
      </View>
    </View>
  );

  const renderDiscussionTab = () => (
    <View style={styles.discussionContainer}>
      <FlatList
        data={group.discussions}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.discussionList}
        renderItem={({ item }) => (
          <View style={[
            styles.messageContainer,
            item.user === 'You' ? styles.yourMessage : styles.otherMessage
          ]}>
            {item.user !== 'You' && (
              <View style={styles.messageAvatar}>
                <Ionicons name="person-circle" size={36} color={colors.primary} />
              </View>
            )}
            <View style={[
              styles.messageBubble,
              item.user === 'You' ? styles.yourBubble : styles.otherBubble
            ]}>
              {item.user !== 'You' && (
                <Text style={styles.messageUser}>{item.user}</Text>
              )}
              <Text style={[
                styles.messageText,
                item.user === 'You' ? styles.yourMessageText : styles.otherMessageText
              ]}>
                {item.message}
              </Text>
              <Text style={styles.messageTime}>{item.time}</Text>
            </View>
          </View>
        )}
      />
      <View style={styles.messageInput}>
        <TextInput
          style={styles.messageTextInput}
          placeholder="Type a message..."
          value={message}
          onChangeText={setMessage}
          multiline
          placeholderTextColor="#666"
        />
        <Pressable style={styles.sendButton}>
          <Ionicons name="send" size={20} color={colors.primary} />
        </Pressable>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.headerMain}>
          <Pressable 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="black" />
          </Pressable>
          <View style={styles.groupInfo}>
            <View style={styles.groupImage}>
              <Ionicons name="people" size={24} color={colors.primary} />
            </View>
            <View>
              <Text style={styles.groupName}>{group.name}</Text>
              <Text style={styles.groupMembers}>{group.members.length} members</Text>
            </View>
          </View>
          <Pressable style={styles.exportButton}>
            <Ionicons name="share-outline" size={24} color="#666" />
          </Pressable>
        </View>
      </View>

      <View style={styles.tabs}>
        {tabs.map(tab => (
          <Pressable
            key={tab.id}
            style={[styles.tab, activeTab === tab.id && styles.activeTab]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Text style={[
              styles.tabText,
              activeTab === tab.id && styles.activeTabText
            ]}>
              {tab.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {activeTab === 'expenses' && renderExpensesTab()}
      {activeTab === 'balance' && renderBalanceTab()}
      {activeTab === 'balances' && renderBalancesTab()}
      {activeTab === 'discussion' && renderDiscussionTab()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: 'white',
  },
  headerMain: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 16,
  },
  backButton: {
    padding: 4,
  },
  groupInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  groupImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  groupName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 2,
  },
  groupMembers: {
    fontSize: 14,
    color: '#666',
  },
  exportButton: {
    padding: 4,
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: 'white',
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 15,
    color: '#666',
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: '600',
  },
  tabContent: {
    flex: 1,
    padding: 16,
  },
  expenseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  expenseTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  addButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '500',
  },
  expenseCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  expenseMain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  expenseLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  expenseDescription: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  expenseDate: {
    fontSize: 14,
    color: '#666',
  },
  expenseRight: {
    alignItems: 'flex-end',
  },
  expenseAmount: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  expensePaidBy: {
    fontSize: 14,
    color: '#666',
  },
  expenseSplit: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  expenseSplitText: {
    fontSize: 14,
    color: '#666',
  },
  totalBalance: {
    alignItems: 'center',
    marginBottom: 24,
  },
  totalBalanceLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  totalBalanceAmount: {
    fontSize: 32,
    fontWeight: '600',
    color: colors.primary,
  },
  balanceList: {
    gap: 12,
  },
  balanceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  balanceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  memberName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  memberSpent: {
    fontSize: 14,
    color: '#666',
  },
  memberBalance: {
    fontSize: 16,
    fontWeight: '600',
  },
  balanceStats: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  balanceStat: {
    flex: 1,
    alignItems: 'center',
  },
  balanceStatDivider: {
    width: 1,
    backgroundColor: '#E0E0E0',
  },
  balanceStatLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  balanceStatAmount: {
    fontSize: 18,
    fontWeight: '600',
  },
  settleUpCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  settleUpTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  settleUpDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  settleUpButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  settleUpButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  discussionContainer: {
    flex: 1,
  },
  discussionList: {
    padding: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    maxWidth: '80%',
  },
  messageAvatar: {
    marginRight: 8,
    alignSelf: 'flex-end',
  },
  yourMessage: {
    alignSelf: 'flex-end',
  },
  otherMessage: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    padding: 12,
    borderRadius: 16,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  yourBubble: {
    backgroundColor: colors.primary + '15',
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    borderBottomLeftRadius: 4,
  },
  messageUser: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
    marginBottom: 4,
  },
  yourMessageText: {
    color: colors.primary,
  },
  otherMessageText: {
    color: '#000',
  },
  messageTime: {
    fontSize: 12,
    color: '#666',
  },
  messageInput: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    backgroundColor: 'white',
  },
  messageTextInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    fontSize: 15,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
}); 