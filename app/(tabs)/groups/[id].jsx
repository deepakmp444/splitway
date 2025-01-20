import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, FlatList, Image, Alert, Modal, Share } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { colors } from '../../../util/constant';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Clipboard from 'expo-clipboard';

// Add this before the GroupDetails component
const shareOptions = [
  { id: 'copy', name: 'Copy Link', icon: 'copy-outline', color: '#607D8B' },
  { id: 'whatsapp', name: 'WhatsApp', icon: 'logo-whatsapp', color: '#25D366' },
  { id: 'twitter', name: 'Twitter', icon: 'logo-twitter', color: '#1DA1F2' },
  { id: 'facebook', name: 'Facebook', icon: 'logo-facebook', color: '#1877F2' },
  { id: 'instagram', name: 'Instagram', icon: 'logo-instagram', color: '#E4405F' },
  { id: 'more', name: 'More Options', icon: 'share-social-outline', color: '#FF9800' },
];

export default function GroupDetails() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState('expenses');
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingMembers, setIsAddingMembers] = useState(false);
  const [isAddBudgetModalVisible, setIsAddBudgetModalVisible] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [newBudget, setNewBudget] = useState({
    category: '',
    limit: '',
    icon: 'cart',
    color: '#2196F3'
  });
  
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
    expenses: Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      description: `Expense ${i + 1}`,
      amount: Math.floor(Math.random() * 100) + 1,
      paidBy: ['You', 'John', 'Sarah', 'Mike'][i % 4],
      date: '2024-01-15',
      splitBetween: ['You', 'John', 'Sarah', 'Mike'],
      category: ['Travel', 'Food', 'Transport'][i % 3]
    })),
    discussions: [
      { id: 1, user: 'John', message: 'When are we splitting the dinner bill?', time: '2 hours ago', avatar: null },
      { id: 2, user: 'Sarah', message: 'I\'ll transfer my part tonight', time: '1 hour ago', avatar: null },
      { id: 3, user: 'You', message: 'Thanks Sarah! Mike, what about you?', time: '30 mins ago', avatar: null },
      { id: 4, user: 'Mike', message: 'Will do it tomorrow morning', time: '15 mins ago', avatar: null },
    ]
  };

  // Modified to include static examples of all status types
  const [settlements, setSettlements] = useState([
    {
      from: { name: "John", balance: -50 },
      to: { name: "Alice", balance: 50 },
      amount: 50,
      status: 'pending',
      requestedAt: null,
      settledAt: null
    },
    {
      from: { name: "Mike", balance: -30 },
      to: { name: "Sarah", balance: 30 },
      amount: 30,
      status: 'requested',
      requestedAt: new Date().toISOString(),
      settledAt: null
    },
    {
      from: { name: "David", balance: -25 },
      to: { name: "Emma", balance: 25 },
      amount: 25,
      status: 'settled',
      requestedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // yesterday
      settledAt: new Date().toISOString()
    }
  ]);

  // Add this near other mock data
  const availableMembers = [
    { id: 5, name: 'Emma', email: 'emma@example.com', avatar: null },
    { id: 6, name: 'David', email: 'david@example.com', avatar: null },
    { id: 7, name: 'Sophie', email: 'sophie@example.com', avatar: null },
    { id: 8, name: 'James', email: 'james@example.com', avatar: null },
  ];

  const tabs = [
    { id: 'expenses', label: 'Expenses', icon: 'cash-outline' },
    { id: 'balance', label: 'Balance', icon: 'wallet-outline' },
    { id: 'settle', label: 'Settle Up', icon: 'swap-horizontal-outline' },
    { id: 'members', label: 'Members', icon: 'people-outline' },
    { id: 'discussion', label: 'Discussion', icon: 'chatbubbles-outline' },
    { id: 'budget', label: 'Budget', icon: 'calculator-outline' },
    { id: 'report', label: 'Report', icon: 'document-text-outline' },
  ];

  const GroupSummaryCard = () => (
    <View style={styles.summaryCard}>
      <View style={styles.summaryMain}>
        <Text style={styles.summaryTitle}>Total Group Expenses</Text>
        <Text style={styles.summaryAmount}>${group.totalExpenses}</Text>
        <View style={styles.summaryStats}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Your Total Spent</Text>
            <Text style={styles.statValue}>${group.members[0].spent}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Your Balance</Text>
            <Text style={[
              styles.statValue,
              { color: group.members[0].balance >= 0 ? '#4CAF50' : '#F44336' }
            ]}>
              ${group.members[0].balance}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderExpensesTab = () => (
    <View style={styles.tabContent}>
  
      <View style={styles.expenseHeader}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search expenses..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#666"
          />
        </View>
        <Pressable 
          style={styles.addButton}
          onPress={() => router.push(`/add-expense?groupId=${id}`)}
        >
          <Ionicons name="add" size={20} color="white" />
          <Text style={styles.addButtonText}>Add</Text>
        </Pressable>
      </View>

      <FlatList
        data={group.expenses.filter(expense => 
          expense.description.toLowerCase().includes(searchQuery.toLowerCase())
        )}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item: expense }) => (
          <Pressable 
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
                    name={
                      expense.category === 'Travel' ? 'airplane' : 
                      expense.category === 'Food' ? 'restaurant' : 'car'
                    } 
                    size={20} 
                    color={
                      expense.category === 'Travel' ? '#1976D2' : 
                      expense.category === 'Food' ? '#F57C00' : '#43A047'
                    } 
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
            <View style={styles.expenseDetails}>
              <View style={styles.splitInfo}>
                <Ionicons name="people" size={16} color="#666" />
                <Text style={styles.splitText}>
                  Split between {expense.splitBetween.join(', ')}
                </Text>
              </View>
              <View style={styles.shareInfo}>
                <Text style={styles.shareText}>Your share: </Text>
                <Text style={styles.shareAmount}>
                  ${(expense.amount / expense.splitBetween.length).toFixed(2)}
                </Text>
              </View>
            </View>
          </Pressable>
        )}
      />
    </View>
  );

  const renderBalanceTab = () => (
    <ScrollView style={styles.tabContent}>
      <GroupSummaryCard />
      
      {/* Stats Row */}
      <View style={styles.balanceStats}>
        <View style={[styles.statCard, { backgroundColor: '#E3F2FD' }]}>
          <Ionicons name="trophy" size={24} color="#1976D2" />
          <Text style={styles.statCardTitle}>Highest Spender</Text>
          <Text style={[styles.statCardValue, { color: '#1976D2' }]}>
            {group.members.reduce((prev, current) => 
              prev.spent > current.spent ? prev : current
            ).name}
          </Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#FFF3E0' }]}>
          <Ionicons name="star" size={24} color="#F57C00" />
          <Text style={styles.statCardTitle}>Most Common</Text>
          <Text style={[styles.statCardValue, { color: '#F57C00' }]}>Food</Text>
        </View>
      </View>

      {/* Category Cards */}
      <View style={styles.balanceCards}>
        {[
          { name: 'Travel', icon: 'airplane', color: '#1976D2', bg: '#E3F2FD' },
          { name: 'Food', icon: 'restaurant', color: '#F57C00', bg: '#FFF3E0' },
          { name: 'Transport', icon: 'car', color: '#43A047', bg: '#E8F5E9' },
          { name: 'Shopping', icon: 'cart', color: '#7B1FA2', bg: '#F3E5F5' },
          { name: 'Entertainment', icon: 'game-controller', color: '#C2185B', bg: '#FCE4EC' },
          { name: 'Others', icon: 'grid', color: '#455A64', bg: '#ECEFF1' },
        ].map(category => (
          <View 
            key={category.name} 
            style={[styles.balanceCard, { backgroundColor: category.bg }]}
          >
            <View style={styles.balanceCardHeader}>
              <View style={[styles.categoryIconContainer, { backgroundColor: category.color + '20' }]}>
                <Ionicons 
                  name={category.icon}
                  size={24} 
                  color={category.color}
                />
              </View>
              <Text style={[styles.balanceCardTitle, { color: category.color }]}>
                {category.name}
              </Text>
            </View>
            <Text style={[styles.balanceAmount, { color: category.color }]}>
              ${Math.floor(Math.random() * 500)}
            </Text>
            <Text style={styles.balancePercent}>
              {Math.floor(Math.random() * 30) + 10}% of total
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );

  const handleCashPayment = (settlementIndex) => {
    Alert.alert(
      "Confirm Settlement Request",
      "Are you sure you want to mark this payment as paid in cash?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Yes, Send Request",
          onPress: () => {
            setSettlements(prevSettlements => 
              prevSettlements.map((settlement, index) => 
                index === settlementIndex 
                  ? { 
                      ...settlement, 
                      status: 'requested',
                      requestedAt: new Date().toISOString()
                    }
                  : settlement
              )
            );
            Alert.alert(
              "Success",
              "Payment request has been sent!"
            );
          }
        }
      ]
    );
  };

  const renderSettleTab = () => {
    // Calculate total to pay and to receive
    const totalToPay = settlements
      .filter(s => s.from.name === "You" && s.status !== 'settled')
      .reduce((sum, s) => sum + s.amount, 0);
      
    const totalToReceive = settlements
      .filter(s => s.to.name === "You" && s.status !== 'settled')
      .reduce((sum, s) => sum + s.amount, 0);

    return (
      <ScrollView style={styles.tabContent}>
        <View style={styles.settleHeader}>
          <Text style={styles.settleTitle}>Settle Up</Text>
          <View style={styles.settleSummaryContainer}>
            <View style={[styles.settleSummaryCard, { backgroundColor: '#FFE0E0' }]}>
              <Text style={styles.settleSummaryLabel}>You need to pay</Text>
              <Text style={[styles.settleSummaryAmount, { color: '#E53935' }]}>
                ${totalToPay}
              </Text>
            </View>
            <View style={[styles.settleSummaryCard, { backgroundColor: '#E0F2E9' }]}>
              <Text style={styles.settleSummaryLabel}>You will receive</Text>
              <Text style={[styles.settleSummaryAmount, { color: '#43A047' }]}>
                ${totalToReceive}
              </Text>
            </View>
          </View>
          <Text style={styles.settleSubtitle}>Payment Suggestions</Text>
        </View>

        {settlements.map((settlement, index) => (
          <View key={index} style={[
            styles.settleCard,
            settlement.status === 'settled' && styles.settledCard
          ]}>
            <View style={styles.settlementInfo}>
              <View style={styles.settlementUsers}>
                <View style={styles.userAvatar}>
                  <Ionicons 
                    name="person" 
                    size={24} 
                    color={settlement.status === 'settled' ? '#43A047' : '#E53935'} 
                  />
                </View>
                <Text style={styles.userName}>{settlement.from.name}</Text>
                <Ionicons name="arrow-forward" size={20} color="#666" />
                <View style={styles.userAvatar}>
                  <Ionicons name="person" size={24} color="#43A047" />
                </View>
                <Text style={styles.userName}>{settlement.to.name}</Text>
              </View>
              <Text style={styles.settlementAmount}>${settlement.amount}</Text>
            </View>

            {settlement.status === 'settled' && (
              <View style={styles.settledStatus}>
                <Ionicons name="checkmark-circle" size={24} color="#43A047" />
                <Text style={styles.settledText}>Settled</Text>
                <Text style={styles.settledDate}>Today</Text>
              </View>
            )}

            {settlement.status === 'requested' && (
              <View style={styles.requestedStatus}>
                <Ionicons name="time-outline" size={20} color="#1976D2" />
                <Text style={styles.requestedText}>
                  Request sent to {settlement.to.name}
                </Text>
                <Text style={styles.requestedDate}>
                  {new Date(settlement.requestedAt).toLocaleDateString()}
                </Text>
              </View>
            )}

            {settlement.status === 'pending' && (
              <>
                
                <Pressable 
                  style={styles.cashPayButton}
                  onPress={() => handleCashPayment(index)}
                >
                  <View style={[styles.paymentIconContainer, { backgroundColor: '#E8F5E9' }]}>
                    <Ionicons name="cash" size={20} color="#43A047" />
                  </View>
                  <View style={styles.paymentInfo}>
                    <Text style={styles.paymentTitle}>Mark as Paid in Cash</Text>
                    <Text style={styles.paymentSubtitle}>Tap to settle this payment</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#666" />
                </Pressable>
              </>
            )}
          </View>
        ))}
      </ScrollView>
    );
  };

  const renderMembersTab = () => (
    <ScrollView style={styles.membersContainer}>
      {/* Header Section */}
      <View style={styles.membersHeaderCard}>
        <View style={styles.membersHeaderTop}>
          <View>
            <Text style={styles.membersHeaderTitle}>Group Members</Text>
            <Text style={styles.membersHeaderSubtitle}>
              {group.members.length} members in this group
            </Text>
          </View>
          <Pressable 
            style={styles.headerButton}
            onPress={() => setIsAddingMembers(!isAddingMembers)}
          >
            <Ionicons 
              name={isAddingMembers ? "close" : "person-add-outline"} 
              size={24} 
              color={colors.primary} 
            />
          </Pressable>
        </View>
      </View>

      {/* Current Members List */}
      {!isAddingMembers && (
        <View style={styles.membersList}>
          {group.members.map((member, index) => (
            <Pressable 
              key={member.id}
              style={[
                styles.memberItemCard,
                index !== group.members.length - 1 && styles.memberItemBorder
              ]}
            >
              <View style={styles.memberItemLeft}>
                <View style={styles.memberAvatarContainer}>
                  {member.avatar ? (
                    <Image 
                      source={{ uri: member.avatar }} 
                      style={styles.memberAvatar} 
                    />
                  ) : (
                    <View style={[styles.memberAvatar, { backgroundColor: colors.primary + '20' }]}>
                      <Text style={styles.memberInitial}>
                        {member.name.charAt(0)}
                      </Text>
                    </View>
                  )}
                  {member.name === 'You' && (
                    <View style={styles.adminBadge}>
                      <Ionicons name="star" size={12} color="#FFD700" />
                    </View>
                  )}
                </View>
                <View style={styles.memberInfo}>
                  <Text style={styles.memberName}>
                    {member.name}
                    {member.name === 'You' && ' (You)'}
                  </Text>
                  <Text style={styles.memberRole}>
                    {member.name === 'You' ? 'Admin' : 'Member'}
                  </Text>
                </View>
              </View>
              {member.name !== 'You' && (
                <Pressable
                  style={styles.memberActionButton}
                  onPress={() => Alert.alert(
                    'Remove Member',
                    `Are you sure you want to remove ${member.name} from this group?`,
                    [
                      { text: 'Cancel', style: 'cancel' },
                      {
                        text: 'Remove',
                        style: 'destructive',
                        onPress: () => Alert.alert(
                          'Member Removed',
                          `${member.name} has been removed from the group`
                        ),
                      },
                    ]
                  )}
                >
                  <Ionicons name="remove-circle-outline" size={24} color="#FF4444" />
                </Pressable>
              )}
            </Pressable>
          ))}
        </View>
      )}

      {/* Available Members List */}
      {isAddingMembers && (
        <View style={styles.membersList}>
          <Text style={styles.sectionTitle}>Available Members</Text>
          {availableMembers.map((member, index) => (
            <Pressable 
              key={member.id}
              style={[
                styles.memberItemCard,
                index !== availableMembers.length - 1 && styles.memberItemBorder
              ]}
            >
              <View style={styles.memberItemLeft}>
                <View style={styles.memberAvatarContainer}>
                  {member.avatar ? (
                    <Image 
                      source={{ uri: member.avatar }} 
                      style={styles.memberAvatar} 
                    />
                  ) : (
                    <View style={[styles.memberAvatar, { backgroundColor: colors.primary + '20' }]}>
                      <Text style={styles.memberInitial}>
                        {member.name.charAt(0)}
                      </Text>
                    </View>
                  )}
                </View>
                <View style={styles.memberInfo}>
                  <Text style={styles.memberName}>{member.name}</Text>
                  <Text style={styles.memberEmail}>{member.email}</Text>
                </View>
              </View>
              <Pressable
                style={styles.memberActionButton}
                onPress={() => Alert.alert(
                  'Add Member',
                  `Do you want to add ${member.name} to this group?`,
                  [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'Add',
                      onPress: () => Alert.alert(
                        'Member Added',
                        `${member.name} has been added to the group`
                      ),
                    },
                  ]
                )}
              >
                <Ionicons name="add-circle-outline" size={24} color={colors.primary} />
              </Pressable>
            </Pressable>
          ))}
        </View>
      )}
    </ScrollView>
  );

  const renderDiscussionTab = () => (
    <View style={styles.tabContent}>
      <FlatList
        data={group.discussions}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={[
            styles.messageContainer,
            item.user === 'You' ? styles.yourMessage : styles.otherMessage
          ]}>
            <View style={styles.messageContent}>
              <Text style={styles.messageUser}>{item.user}</Text>
              <Text style={styles.messageText}>{item.message}</Text>
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
        />
        <Pressable style={styles.sendButton}>
          <Ionicons name="send" size={24} color={colors.primary} />
        </Pressable>
      </View>
    </View>
  );

  const renderReportTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.reportHeader}>
        <Text style={styles.reportTitle}>Export Report</Text>
      </View>
      <View style={styles.reportOptions}>
        <Pressable style={styles.reportOption}>
          <Ionicons name="document-text" size={24} color={colors.primary} />
          <Text style={styles.reportOptionText}>Export as PDF</Text>
        </Pressable>
        <Pressable style={styles.reportOption}>
          <Ionicons name="document" size={24} color={colors.primary} />
          <Text style={styles.reportOptionText}>Export as CSV</Text>
        </Pressable>
      </View>
    </View>
  );

  const [budgets, setBudgets] = useState([
    { id: 1, category: 'Movie', icon: 'film', spent: 150, limit: 200, color: '#E91E63' },
    { id: 2, category: 'Transport', icon: 'bus', spent: 80, limit: 100, color: '#2196F3' },
    { id: 3, category: 'Food', icon: 'restaurant', spent: 280, limit: 300, color: '#FF9800' },
    { id: 4, category: 'Shopping', icon: 'cart', spent: 400, limit: 500, color: '#4CAF50' },
  ]);

  const handleAddBudget = () => {
    setEditingBudget(null);
    setNewBudget({
      category: '',
      limit: '',
      icon: 'cart',
      color: '#2196F3'
    });
    setIsAddBudgetModalVisible(true);
  };

  const handleEditBudget = (budget) => {
    setEditingBudget(budget);
    setNewBudget({
      category: budget.category,
      limit: budget.limit.toString(),
      icon: budget.icon,
      color: budget.color
    });
    setIsAddBudgetModalVisible(true);
  };

  const handleDeleteBudget = (budgetId) => {
    Alert.alert(
      "Delete Budget",
      "Are you sure you want to delete this budget?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setBudgets(prevBudgets => 
              prevBudgets.filter(budget => budget.id !== budgetId)
            );
          }
        }
      ]
    );
  };

  const handleSaveBudget = () => {
    if (!newBudget.category || !newBudget.limit) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setBudgets(prevBudgets => {
      if (editingBudget) {
        // Edit existing budget
        return prevBudgets.map(budget =>
          budget.id === editingBudget.id
            ? {
                ...budget,
                category: newBudget.category,
                limit: parseFloat(newBudget.limit),
                icon: newBudget.icon,
                color: newBudget.color
              }
            : budget
        );
      } else {
        // Add new budget
        const newId = Math.max(...prevBudgets.map(b => b.id), 0) + 1;
        return [...prevBudgets, {
          id: newId,
          category: newBudget.category,
          limit: parseFloat(newBudget.limit),
          spent: 0,
          icon: newBudget.icon,
          color: newBudget.color
        }];
      }
    });

    setIsAddBudgetModalVisible(false);
    setEditingBudget(null);
    setNewBudget({
      category: '',
      limit: '',
      icon: 'cart',
      color: '#2196F3'
    });
  };

  const renderBudgetTab = () => (
    <ScrollView style={styles.tabContent}>
      <View style={styles.budgetHeader}>
        <Text style={styles.budgetTitle}>Budget Overview</Text>
        <Pressable 
          style={styles.addBudgetButton}
          onPress={() => router.push(`/(tabs)/groups/manage-budget?groupId=${id}`)}
        >
          <Ionicons name="add-circle-outline" size={24} color={colors.primary} />
          <Text style={styles.addBudgetText}>Add Budget</Text>
        </Pressable>
      </View>

      <View style={styles.budgetCards}>
        {budgets.map(budget => {
          const progress = (budget.spent / budget.limit) * 100;
          const isOverBudget = budget.spent > budget.limit;

          return (
            <View key={budget.id} style={styles.budgetCard}>
              <View style={styles.budgetCardHeader}>
                <View style={[styles.budgetIconContainer, { backgroundColor: budget.color + '20' }]}>
                  <Ionicons name={budget.icon} size={24} color={budget.color} />
                </View>
                <View style={styles.budgetInfo}>
                  <Text style={styles.budgetCategory}>{budget.category}</Text>
                  <Text style={styles.budgetLimit}>Budget: ${budget.limit}</Text>
                </View>
                <Pressable 
                  style={styles.budgetMoreButton}
                  onPress={() => {
                    Alert.alert(
                      "Budget Options",
                      "Choose an action",
                      [
                        {
                          text: "Edit",
                          onPress: () => handleEditBudget(budget)
                        },
                        {
                          text: "Delete",
                          style: "destructive",
                          onPress: () => handleDeleteBudget(budget.id)
                        },
                        {
                          text: "Cancel",
                          style: "cancel"
                        }
                      ]
                    );
                  }}
                >
                  <Ionicons name="ellipsis-vertical" size={20} color="#666" />
                </Pressable>
              </View>

              <View style={styles.budgetProgress}>
                <View style={styles.budgetProgressBar}>
                  <View 
                    style={[
                      styles.budgetProgressFill,
                      { 
                        width: `${Math.min(progress, 100)}%`,
                        backgroundColor: isOverBudget ? '#FF5252' : budget.color
                      }
                    ]} 
                  />
                </View>
                <View style={styles.budgetStats}>
                  <Text style={styles.budgetSpent}>
                    Spent: <Text style={{ color: isOverBudget ? '#FF5252' : budget.color }}>${budget.spent}</Text>
                  </Text>
                  <Text style={[
                    styles.budgetRemaining,
                    { color: isOverBudget ? '#FF5252' : '#666' }
                  ]}>
                    {isOverBudget 
                      ? `Exceeded by $${(budget.spent - budget.limit).toFixed(2)}`
                      : `Remaining: $${(budget.limit - budget.spent).toFixed(2)}`
                  }
                  </Text>
                </View>
              </View>
            </View>
          );
        })}
      </View>

      {/* Add/Edit Budget Modal */}
      <Modal
        visible={isAddBudgetModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsAddBudgetModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingBudget ? 'Edit Budget' : 'Add New Budget'}
            </Text>
            
            <TextInput
              style={styles.modalInput}
              placeholder="Category Name"
              value={newBudget.category}
              onChangeText={(text) => setNewBudget(prev => ({ ...prev, category: text }))}
            />
            
            <TextInput
              style={styles.modalInput}
              placeholder="Budget Limit"
              value={newBudget.limit}
              onChangeText={(text) => setNewBudget(prev => ({ ...prev, limit: text }))}
              keyboardType="numeric"
            />

            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => setIsAddBudgetModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.modalButtonSave]}
                onPress={handleSaveBudget}
              >
                <Text style={[styles.modalButtonText, { color: 'white' }]}>Save</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );

  const [isShareModalVisible, setIsShareModalVisible] = useState(false);

  const handleShare = async (platform) => {
    const shareMessage = `Check out our group "${group.name}" on ExpenseShare!\nTotal Expenses: $${group.totalExpenses}\nMembers: ${group.members.length}\n\nJoin using this link: https://expenseshare.app/groups/${id}`;
    
    try {
      switch (platform) {
        case 'copy':
          await Clipboard.setStringAsync(`https://expenseshare.app/groups/${id}`);
          Alert.alert('Success', 'Link copied to clipboard!');
          break;
          
        case 'whatsapp':
          await Share.share({
            message: shareMessage,
            url: `https://expenseshare.app/groups/${id}`,
          }, {
            social: Share.Social.WHATSAPP
          });
          break;
          
        case 'twitter':
          await Share.share({
            message: shareMessage,
            url: `https://expenseshare.app/groups/${id}`,
          }, {
            social: Share.Social.TWITTER
          });
          break;
          
        case 'facebook':
          await Share.share({
            message: shareMessage,
            url: `https://expenseshare.app/groups/${id}`,
          }, {
            social: Share.Social.FACEBOOK
          });
          break;
          
        case 'instagram':
          // Instagram doesn't support direct sharing via API
          // We'll use the general share dialog instead
          await Share.share({
            message: shareMessage,
            url: `https://expenseshare.app/groups/${id}`,
          });
          break;
          
        case 'more':
          await Share.share({
            message: shareMessage,
            url: `https://expenseshare.app/groups/${id}`,
          });
          break;
      }
      setIsShareModalVisible(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to share. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </Pressable>
        <View style={styles.groupInfo}>
          <Text style={styles.groupName}>{group.name}</Text>
          <Text style={styles.groupMembers}>{group.members.length} members</Text>
        </View>
        <View style={styles.headerActions}>
          <Pressable 
            style={styles.headerButton}
            onPress={() => setIsShareModalVisible(true)}
          >
            <Ionicons name="share-social-outline" size={24} color="black" />
          </Pressable>
          <Pressable style={styles.headerButton}>
            <Ionicons name="ellipsis-horizontal" size={24} color="black" />
          </Pressable>
        </View>
      </View>

      <View style={styles.tabs}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContainer}
        >
          {tabs.map(tab => (
            <Pressable
              key={tab.id}
              style={[styles.tab, activeTab === tab.id && styles.activeTab]}
              onPress={() => setActiveTab(tab.id)}
            >
              <Ionicons 
                name={tab.icon} 
                size={20} 
                color={activeTab === tab.id ? colors.primary : '#666'} 
              />
              <Text style={[
                styles.tabText,
                activeTab === tab.id && styles.activeTabText
              ]}>
                {tab.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {activeTab === 'expenses' && renderExpensesTab()}
      {activeTab === 'balance' && renderBalanceTab()}
      {activeTab === 'settle' && renderSettleTab()}
      {activeTab === 'members' && renderMembersTab()}
      {activeTab === 'discussion' && renderDiscussionTab()}
      {activeTab === 'report' && renderReportTab()}
      {activeTab === 'budget' && renderBudgetTab()}

      <Modal
        visible={isShareModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsShareModalVisible(false)}
      >
        <Pressable 
          style={styles.modalOverlay}
          onPress={() => setIsShareModalVisible(false)}
        >
          <View style={styles.shareModalContent}>
            <View style={styles.shareHeader}>
              <Text style={styles.shareTitle}>Share Group</Text>
              <Pressable 
                onPress={() => setIsShareModalVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#666" />
              </Pressable>
            </View>

            <View style={styles.shareOptions}>
              {shareOptions.map((option) => (
                <Pressable
                  key={option.id}
                  style={styles.shareOption}
                  onPress={() => handleShare(option.id)}
                >
                  <View style={[styles.shareIconContainer, { backgroundColor: option.color + '20' }]}>
                    <Ionicons name={option.icon} size={24} color={option.color} />
                  </View>
                  <Text style={styles.shareOptionText}>{option.name}</Text>
                </Pressable>
              ))}
            </View>

            <View style={styles.shareLinkContainer}>
              <Text style={styles.shareLinkTitle}>Group Link</Text>
              <View style={styles.shareLinkBox}>
                <Text style={styles.shareLink} numberOfLines={1}>
                  https://expenseshare.app/groups/{id}
                </Text>
                <Pressable
                  style={styles.copyButton}
                  onPress={() => handleShare('copy')}
                >
                  <Ionicons name="copy-outline" size={20} color={colors.primary} />
                </Pressable>
              </View>
            </View>
          </View>
        </Pressable>
      </Modal>
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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 8,
  },
  groupInfo: {
    flex: 1,
    marginLeft: 16,
  },
  groupName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  groupMembers: {
    fontSize: 14,
    color: '#666',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    padding: 8,
  },
  tabs: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tabsContainer: {
    paddingHorizontal: 16,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 16,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: '600',
  },
  tabContent: {
    flex: 1,
  },
  expenseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 16,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  addButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  expenseCard: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  expenseMain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  },
  expenseDate: {
    fontSize: 14,
    color: '#666',
  },
  expenseRight: {
    alignItems: 'flex-end',
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  expensePaidBy: {
    fontSize: 14,
    color: '#666',
  },
  expenseDetails: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  splitInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  splitText: {
    fontSize: 14,
    color: '#666',
  },
  shareInfo: {
    flexDirection: 'row',
    marginTop: 4,
  },
  shareText: {
    fontSize: 14,
    color: '#666',
  },
  shareAmount: {
    fontSize: 14,
    fontWeight: '600',
  },
  balanceHeader: {
    padding: 16,
  },
  balanceTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  balanceCards: {
    padding: 16,
    gap: 16,
  },
  balanceCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 8,
  },
  balanceCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  categoryIconContainer: {
    padding: 8,
    borderRadius: 12,
  },
  balanceCardTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  balanceAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  balancePercent: {
    fontSize: 14,
    color: '#666',
  },
  settleHeader: {
    padding: 20,
    backgroundColor: '#fff',
  },
  settleTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  settleSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  settleCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  settlementInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  settlementUsers: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {
    fontSize: 16,
    fontWeight: '500',
  },
  settlementAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  settlementActions: {
    marginTop: 16,
    gap: 16,
  },
  onlinePayButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
  },
  cashPayButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    marginTop: 5,
  },
  paymentInfo: {
    flex: 1,
    marginLeft: 12,
  },
  paymentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  paymentSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#eee',
  },
  dividerText: {
    color: '#666',
    fontSize: 14,
  },
  membersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  membersTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  addMemberButton: {
    padding: 8,
  },
  memberCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  memberLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  messageContainer: {
    padding: 16,
  },
  yourMessage: {
    alignItems: 'flex-end',
  },
  otherMessage: {
    alignItems: 'flex-start',
  },
  messageContent: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 12,
    maxWidth: '80%',
  },
  messageUser: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 16,
  },
  messageTime: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  messageInput: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    gap: 12,
  },
  messageTextInput: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 24,
    fontSize: 16,
  },
  sendButton: {
    padding: 8,
  },
  reportHeader: {
    padding: 16,
  },
  reportTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  reportOptions: {
    padding: 16,
    gap: 16,
  },
  reportOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  reportOptionText: {
    fontSize: 16,
    fontWeight: '500',
  },
  summaryCard: {
    margin: 16,
    padding: 16,
    backgroundColor: colors.primary + '10',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.primary + '20',
  },
  summaryMain: {
    alignItems: 'center',
  },
  summaryTitle: {
    fontSize: 16,
    color: '#666',
  },
  summaryAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
    marginVertical: 8,
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 8,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 4,
  },
  balanceStats: {
    flexDirection: 'row',
    padding: 16,
    gap: 16,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  statCardTitle: {
    fontSize: 14,
    color: '#666',
    marginVertical: 8,
  },
  statCardValue: {
    fontSize: 18,
    fontWeight: '600',
  },
  settledCard: {
    opacity: 0.8,
    backgroundColor: '#F5F5F5',
  },
  settledStatus: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  settledText: {
    fontSize: 16,
    color: '#43A047',
    fontWeight: '600',
  },
  settledDate: {
    fontSize: 14,
    color: '#666',
    marginLeft: 'auto',
  },
  requestedStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
    paddingHorizontal: 4,
  },
  requestedText: {
    fontSize: 14,
    color: '#1976D2',
    fontWeight: '500',
    flex: 1,
  },
  requestedDate: {
    fontSize: 12,
    color: '#666',
  },
  membersContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  membersHeaderCard: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  membersHeaderTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  membersHeaderTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  membersHeaderSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  membersList: {
    backgroundColor: 'white',
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    padding: 16,
    paddingBottom: 8,
  },
  memberItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'white',
  },
  memberItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  memberItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  memberAvatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  memberAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  memberInitial: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.primary,
  },
  adminBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 2,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1a1a1a',
  },
  memberRole: {
    fontSize: 14,
    color: colors.primary,
    marginTop: 2,
  },
  memberEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  memberActionButton: {
    padding: 8,
  },
  settleSummaryContainer: {
    flexDirection: 'row',
    gap: 12,
    marginVertical: 16,
  },
  settleSummaryCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    justifyContent: 'center',
  },
  settleSummaryLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  settleSummaryAmount: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
  },
  budgetTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  addBudgetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 8,
    backgroundColor: colors.primary + '10',
    borderRadius: 8,
  },
  addBudgetText: {
    color: colors.primary,
    fontWeight: '600',
  },
  budgetCards: {
    padding: 16,
    gap: 16,
  },
  budgetCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  budgetCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  budgetIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  budgetInfo: {
    flex: 1,
    marginLeft: 12,
  },
  budgetCategory: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  budgetLimit: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  budgetMoreButton: {
    padding: 8,
  },
  budgetProgress: {
    gap: 8,
  },
  budgetProgressBar: {
    height: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
    overflow: 'hidden',
  },
  budgetProgressFill: {
    height: '100%',
    borderRadius: 4,
  },
  budgetStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  budgetSpent: {
    fontSize: 14,
    color: '#666',
  },
  budgetRemaining: {
    fontSize: 14,
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonCancel: {
    backgroundColor: '#f5f5f5',
  },
  modalButtonSave: {
    backgroundColor: colors.primary,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  shareModalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  shareHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  shareTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  closeButton: {
    padding: 4,
  },
  shareOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 24,
  },
  shareOption: {
    alignItems: 'center',
    width: '28%',
  },
  shareIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  shareOptionText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  shareLinkContainer: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 20,
  },
  shareLinkTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  shareLinkBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  shareLink: {
    flex: 1,
    fontSize: 14,
    color: '#666',
  },
  copyButton: {
    padding: 8,
  },
});