import { Image } from 'expo-image';
import { View, Text, StyleSheet, ScrollView, Pressable, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors } from '../../util/constant';
import { PieChart, LineChart, BarChart } from 'react-native-gifted-charts';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Home() {
  const router = useRouter();
  const screenWidth = Dimensions.get('window').width;

  const summaryData = {
    totalBalance: 245,
    monthlySpent: 850,
    activeGroups: 4,
    activeFriends: 8,
    transactions: {
      lent: 450,
      borrowed: 205,
    }
  };

  const recentGroups = [
    {
      id: '1',
      name: 'Weekend Trip',
      totalSpent: 1200,
      members: 5,
      yourBalance: 120,
      isPositive: true,
      recentActivity: '2h ago'
    },
    {
      id: '2',
      name: 'House Expenses',
      totalSpent: 2400,
      members: 3,
      yourBalance: -45,
      isPositive: false,
      recentActivity: '1d ago'
    },
    {
      id: '3',
      name: 'Movie Night',
      totalSpent: 240,
      members: 4,
      yourBalance: 80,
      isPositive: true,
      recentActivity: '2d ago'
    }
  ];

  const recentTransactions = [
    {
      id: 't1',
      type: 'LENT',
      amount: 50,
      user: 'John Doe',
      group: 'Weekend Trip',
      timestamp: '2h ago',
      avatar: 'https://picsum.photos/200'
    },
    {
      id: 't2',
      type: 'BORROWED',
      amount: 25,
      user: 'Sarah Smith',
      group: 'Lunch Group',
      timestamp: '5h ago',
      avatar: 'https://picsum.photos/201'
    },
    {
      id: 't3',
      type: 'SETTLED',
      amount: 75,
      user: 'Mike Johnson',
      group: 'Movie Night',
      timestamp: '1d ago',
      avatar: 'https://picsum.photos/202'
    }
  ];

  // Spending trend data for line chart
  const spendingTrendData = [
    { value: 250, label: 'Jan' },
    { value: 500, label: 'Feb' },
    { value: 745, label: 'Mar' },
    { value: 320, label: 'Apr' },
    { value: 600, label: 'May' },
    { value: 850, label: 'Jun' },
  ];

  // Distribution data for pie chart
  const spendingDistribution = [
    { value: 30, color: '#FF7F50', text: '30%', label: 'Food' },
    { value: 25, color: '#20B2AA', text: '25%', label: 'Travel' },
    { value: 20, color: '#DDA0DD', text: '20%', label: 'Shopping' },
    { value: 15, color: '#FFD700', text: '15%', label: 'Bills' },
    { value: 10, color: '#98FB98', text: '10%', label: 'Others' },
  ];

  // Add monthly comparison data for bar chart
  const monthlyComparison = [
    {
      value: 450,
      label: 'Jan',
      frontColor: colors.primary,
      sideColor: colors.primary + '80',
      topColor: colors.primary + '40',
    },
    {
      value: 750,
      label: 'Feb',
      frontColor: colors.primary,
      sideColor: colors.primary + '80',
      topColor: colors.primary + '40',
    },
    {
      value: 620,
      label: 'Mar',
      frontColor: colors.primary,
      sideColor: colors.primary + '80',
      topColor: colors.primary + '40',
    },
    {
      value: 850,
      label: 'Apr',
      frontColor: colors.primary,
      sideColor: colors.primary + '80',
      topColor: colors.primary + '40',
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Fixed Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <Pressable 
              style={styles.avatarContainer} 
              onPress={() => router.push('/account')}
            >
              <Image
                style={styles.avatar}
                source="https://picsum.photos/200"
                contentFit="cover"
                transition={1000}
              />
              <View style={styles.avatarBadge} />
            </Pressable>
            <View>
              <Text style={styles.welcomeText}>Welcome back,</Text>
              <Text style={styles.nameText}>Deepak</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <Pressable 
              style={styles.iconButton}
              onPress={() => router.push('/search')}
            >
              <Ionicons name="search" size={22} color="#666" />
            </Pressable>
            <Pressable 
              style={styles.iconButton}
              onPress={() => router.push('/activity')}
            >
              <Ionicons name="notifications" size={22} color="#666" />
              <View style={styles.notificationBadge} />
            </Pressable>
          </View>
        </View>

        {/* Quick Actions */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.quickActions}
        >
          <Pressable style={styles.actionButton} onPress={() => router.push('/add-expense')}>
            <View style={[styles.actionIcon, { backgroundColor: `${colors.primary}15` }]}>
              <Ionicons name="add-circle" size={22} color={colors.primary} />
            </View>
            <Text style={styles.actionText}>Add{'\n'}Expense</Text>
          </Pressable>
          <Pressable style={styles.actionButton} onPress={() => router.push('/settle-up')}>
            <View style={[styles.actionIcon, { backgroundColor: '#38b00015' }]}>
              <Ionicons name="swap-horizontal" size={22} color="#38b000" />
            </View>
            <Text style={styles.actionText}>Settle{'\n'}Up</Text>
          </Pressable>
          <Pressable style={styles.actionButton} onPress={() => router.push('/scan-bill')}>
            <View style={[styles.actionIcon, { backgroundColor: '#9747FF15' }]}>
              <Ionicons name="scan" size={22} color="#9747FF" />
            </View>
            <Text style={styles.actionText}>Scan{'\n'}Bill</Text>
          </Pressable>
          <Pressable style={styles.actionButton} onPress={() => router.push('/split-bill')}>
            <View style={[styles.actionIcon, { backgroundColor: '#FF7F5015' }]}>
              <Ionicons name="git-branch" size={22} color="#FF7F50" />
            </View>
            <Text style={styles.actionText}>Split{'\n'}Bill</Text>
          </Pressable>
          <Pressable style={styles.actionButton} onPress={() => router.push('/statistics')}>
            <View style={[styles.actionIcon, { backgroundColor: '#20B2AA15' }]}>
              <Ionicons name="stats-chart" size={22} color="#20B2AA" />
            </View>
            <Text style={styles.actionText}>View{'\n'}Stats</Text>
          </Pressable>
        </ScrollView>
      </View>

      {/* Scrollable Content */}
      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Summary Cards */}
        <View style={styles.summaryContainer}>
          <View style={styles.balanceCard}>
            <View style={styles.balanceHeader}>
              <Text style={styles.balanceTitle}>Total Balance</Text>
              <Text style={[
                styles.balanceAmount,
                { color: summaryData.totalBalance >= 0 ? '#38b000' : '#ff0000' }
              ]}>
                {summaryData.totalBalance >= 0 ? '+' : '-'}${Math.abs(summaryData.totalBalance)}
              </Text>
            </View>
            <View style={styles.balanceDetails}>
              <View style={styles.balanceItem}>
                <Ionicons name="arrow-up" size={20} color="#38b000" />
                <View>
                  <Text style={styles.balanceLabel}>You Lent</Text>
                  <Text style={[styles.balanceValue, { color: '#38b000' }]}>
                    ${summaryData.transactions.lent}
                  </Text>
                </View>
              </View>
              <View style={styles.balanceItem}>
                <Ionicons name="arrow-down" size={20} color="#ff0000" />
                <View>
                  <Text style={styles.balanceLabel}>You Borrowed</Text>
                  <Text style={[styles.balanceValue, { color: '#ff0000' }]}>
                    ${summaryData.transactions.borrowed}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Ionicons name="wallet" size={24} color={colors.primary} />
              <Text style={styles.statValue}>${summaryData.monthlySpent}</Text>
              <Text style={styles.statLabel}>Monthly Spent</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="people" size={24} color={colors.primary} />
              <Text style={styles.statValue}>{summaryData.activeGroups}</Text>
              <Text style={styles.statLabel}>Active Groups</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="person" size={24} color={colors.primary} />
              <Text style={styles.statValue}>{summaryData.activeFriends}</Text>
              <Text style={styles.statLabel}>Active Friends</Text>
            </View>
          </View>
        </View>

        {/* Spending Trend Chart */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Spending Trend</Text>
            <Pressable onPress={() => router.push('/analytics')}>
              <Text style={styles.seeAllText}>See details</Text>
            </Pressable>
          </View>
          <View style={styles.chartCard}>
            <LineChart
              data={spendingTrendData}
              width={screenWidth - 32}
              height={200}
              spacing={40}
              initialSpacing={20}
              color1={colors.primary}
              textColor1="black"
              dataPointsColor1={colors.primary}
              startFillColor1={`${colors.primary}20`}
              endFillColor1={`${colors.primary}00`}
              startOpacity={0.9}
              endOpacity={0.2}
              curved
              hideRules
              hideYAxisText
              xAxisColor={'#EEE'}
              yAxisColor={'#EEE'}
              showVerticalLines
              verticalLinesColor={'#EEE'}
              noOfSections={5}
              maxValue={1000}
              yAxisTextStyle={{ color: '#666' }}
              xAxisLabelTextStyle={{ color: '#666', fontSize: 12 }}
              hideDataPoints
            />
          </View>
        </View>

        {/* Spending Distribution */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Spending Distribution</Text>
          </View>
          <View style={styles.chartCard}>
            <View style={styles.pieChartContainer}>
              <PieChart
                data={spendingDistribution}
                donut
                radius={90}
                innerRadius={60}
                centerLabelComponent={() => (
                  <View style={styles.pieChartCenter}>
                    <Text style={styles.pieChartCenterValue}>${summaryData.monthlySpent}</Text>
                    <Text style={styles.pieChartCenterLabel}>Total Spent</Text>
                  </View>
                )}
              />
              <View style={styles.legendContainer}>
                {spendingDistribution.map((item, index) => (
                  <View key={index} style={styles.legendItem}>
                    <View style={[styles.legendColor, { backgroundColor: item.color }]} />
                    <Text style={styles.legendLabel}>{item.label}</Text>
                    <Text style={styles.legendValue}>{item.text}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* Recent Groups */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Groups</Text>
            <Pressable onPress={() => router.push('/groups')}>
              <Text style={styles.seeAllText}>See all</Text>
            </Pressable>
          </View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.groupsContainer}
          >
            {recentGroups.map(group => (
              <Pressable 
                key={group.id}
                style={styles.groupCard}
                onPress={() => router.push(`/group/${group.id}`)}
              >
                <View style={styles.groupHeader}>
                  <Text style={styles.groupName}>{group.name}</Text>
                  <Text style={[
                    styles.groupBalance,
                    { color: group.isPositive ? '#38b000' : '#ff0000' }
                  ]}>
                    {group.isPositive ? '+' : '-'}${Math.abs(group.yourBalance)}
                  </Text>
                </View>
                <View style={styles.groupInfo}>
                  <Text style={styles.groupInfoText}>
                    ${group.totalSpent} total • {group.members} members
                  </Text>
                  <Text style={styles.groupActivity}>{group.recentActivity}</Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Recent Transactions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <Pressable onPress={() => router.push('/transactions')}>
              <Text style={styles.seeAllText}>See all</Text>
            </Pressable>
          </View>
          {recentTransactions.map(transaction => (
            <View key={transaction.id} style={styles.transactionCard}>
              <Image
                source={transaction.avatar}
                style={styles.transactionAvatar}
                contentFit="cover"
                transition={1000}
              />
              <View style={styles.transactionInfo}>
                <View style={styles.transactionHeader}>
                  <Text style={styles.transactionUser}>{transaction.user}</Text>
                  <Text style={[
                    styles.transactionAmount,
                    { 
                      color: transaction.type === 'LENT' ? '#38b000' : 
                             transaction.type === 'BORROWED' ? '#ff0000' : '#666' 
                    }
                  ]}>
                    {transaction.type === 'LENT' ? '+' : 
                     transaction.type === 'BORROWED' ? '-' : ''}
                    ${transaction.amount}
                  </Text>
                </View>
                <View style={styles.transactionDetails}>
                  <Text style={styles.transactionGroup}>{transaction.group}</Text>
                  <Text style={styles.transactionTime}>{transaction.timestamp}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Monthly Expense Comparison */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Monthly Comparison</Text>
            <Pressable onPress={() => router.push('/analytics')}>
              <Text style={styles.seeAllText}>See details</Text>
            </Pressable>
          </View>
          <View style={styles.chartCard}>
            <BarChart
              data={monthlyComparison}
              width={screenWidth - 64}
              height={200}
              barWidth={32}
              spacing={24}
              initialSpacing={20}
              roundedTop
              roundedBottom
              hideRules
              xAxisThickness={1}
              yAxisThickness={1}
              xAxisColor={'#EEE'}
              yAxisColor={'#EEE'}
              yAxisTextStyle={{ color: '#666' }}
              labelWidth={40}
              labelsExtraHeight={20}
              noOfSections={5}
              maxValue={1000}
            />
          </View>
        </View>

        {/* Add Payment Methods Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Payment Methods</Text>
            <Pressable onPress={() => router.push('/payment-methods')}>
              <Text style={styles.seeAllText}>Manage</Text>
            </Pressable>
          </View>
          <View style={styles.paymentMethodsContainer}>
            {['Wallet', 'Bank', 'UPI'].map((method, index) => (
              <View key={index} style={styles.paymentMethod}>
                <Ionicons 
                  name={
                    method === 'Wallet' ? 'wallet' : 
                    method === 'Bank' ? 'business' : 'phone-portrait'
                  } 
                  size={24} 
                  color={colors.primary} 
                />
                <Text style={styles.paymentMethodText}>{method}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    paddingBottom: 8,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  avatarBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#38b000',
    borderWidth: 2,
    borderColor: 'white',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeText: {
    fontSize: 13,
    color: '#666',
  },
  nameText: {
    fontSize: 16,
    fontWeight: '600',
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ff0000',
  },
  quickActions: {
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 20,
    flexDirection: 'row',
  },
  actionButton: {
    alignItems: 'center',
    gap: 6,
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 16,
  },
  summaryContainer: {
    padding: 16,
    gap: 16,
  },
  balanceCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  balanceHeader: {
    marginBottom: 16,
  },
  balanceTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  balanceDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  balanceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  balanceLabel: {
    fontSize: 12,
    color: '#666',
  },
  balanceValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeAllText: {
    color: colors.primary,
    fontWeight: '500',
  },
  groupsContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
  groupCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    width: 250,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  groupName: {
    fontSize: 16,
    fontWeight: '600',
  },
  groupBalance: {
    fontSize: 16,
    fontWeight: '600',
  },
  groupInfo: {
    gap: 4,
  },
  groupInfoText: {
    fontSize: 14,
    color: '#666',
  },
  groupActivity: {
    fontSize: 12,
    color: '#666',
  },
  transactionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  transactionAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  transactionUser: {
    fontSize: 16,
    fontWeight: '500',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  transactionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  transactionGroup: {
    fontSize: 14,
    color: '#666',
  },
  transactionTime: {
    fontSize: 12,
    color: '#666',
  },
  chartCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  pieChartContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  pieChartCenter: {
    alignItems: 'center',
  },
  pieChartCenterValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
  },
  pieChartCenterLabel: {
    fontSize: 12,
    color: '#666',
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
    marginTop: 24,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    minWidth: 100,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendLabel: {
    fontSize: 12,
    color: '#666',
    marginRight: 4,
  },
  legendValue: {
    fontSize: 12,
    fontWeight: '500',
  },
  scrollContent: {
    flex: 1,
    backgroundColor: '#f9faf9',
  },
  paymentMethodsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    marginTop: 8,
  },
  paymentMethod: {
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    minWidth: 100,
  },
  paymentMethodText: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
}); 