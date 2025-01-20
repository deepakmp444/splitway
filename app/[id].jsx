import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors } from '../util/constant';

const GroupDetails = ({ id, budget, totalExpenses }) => {
  const router = useRouter();
  const [groupDetails, setGroupDetails] = useState({
    budget: budget || null,
    totalExpenses: totalExpenses || 0
  });

  useEffect(() => {
    // Update group details when props change
    setGroupDetails({
      budget: budget || null,
      totalExpenses: totalExpenses || 0
    });
  }, [budget, totalExpenses]);

  const getBudgetProgress = () => {
    if (!groupDetails.budget) return 0;
    const progress = (groupDetails.totalExpenses / parseFloat(groupDetails.budget)) * 100;
    return Math.min(progress, 100);
  };

  const getRemainingBudget = () => {
    if (!groupDetails.budget) return 0;
    return (parseFloat(groupDetails.budget) - groupDetails.totalExpenses).toFixed(2);
  };

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionLeft}>
          <Ionicons name="wallet" size={24} color={colors.primary} />
          <Text style={styles.sectionTitle}>Budget</Text>
        </View>
        <Pressable
          style={styles.manageBudgetButton}
          onPress={() => router.push(`/manage-budget?groupId=${id}`)}
        >
          <Text style={styles.manageBudgetText}>Manage</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.primary} />
        </Pressable>
      </View>
      
      {groupDetails.budget ? (
        <View style={styles.budgetContainer}>
          <Text style={styles.budgetLabel}>Current Budget</Text>
          <Text style={styles.budgetAmount}>${groupDetails.budget}</Text>
          <View style={styles.budgetProgress}>
            <View 
              style={[
                styles.budgetBar,
                { width: `${getBudgetProgress()}%` },
                getBudgetProgress() >= 100 && styles.budgetBarExceeded
              ]} 
            />
          </View>
          <View style={styles.budgetInfo}>
            <Text style={styles.budgetSpent}>
              ${groupDetails.totalExpenses.toFixed(2)} spent
            </Text>
            <Text style={[
              styles.budgetRemaining,
              parseFloat(getRemainingBudget()) < 0 && styles.budgetExceeded
            ]}>
              ${getRemainingBudget()} remaining
            </Text>
          </View>
        </View>
      ) : (
        <Pressable
          style={styles.addBudgetButton}
          onPress={() => router.push(`/manage-budget?groupId=${id}`)}
        >
          <Ionicons name="add-circle" size={24} color={colors.primary} />
          <Text style={styles.addBudgetText}>Add Budget</Text>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    padding: 16,
    backgroundColor: '#fff',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  manageBudgetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: 8,
  },
  manageBudgetText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  budgetContainer: {
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  budgetLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  budgetAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 16,
  },
  budgetProgress: {
    height: 8,
    backgroundColor: '#eee',
    borderRadius: 4,
    overflow: 'hidden',
  },
  budgetBar: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  budgetBarExceeded: {
    backgroundColor: '#ff4444',
  },
  budgetInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  budgetSpent: {
    fontSize: 14,
    color: '#666',
  },
  budgetRemaining: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  budgetExceeded: {
    color: '#ff4444',
  },
  addBudgetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 16,
    backgroundColor: colors.primary + '10',
    borderRadius: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: colors.primary + '20',
  },
  addBudgetText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '500',
  },
});

export default GroupDetails; 