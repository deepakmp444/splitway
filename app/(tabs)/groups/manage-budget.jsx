import { View, Text, StyleSheet, TextInput, Pressable, ScrollView, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../../util/constant';

const iconOptions = [
  { name: 'cart', label: 'Shopping' },
  { name: 'restaurant', label: 'Food' },
  { name: 'airplane', label: 'Travel' },
  { name: 'car', label: 'Transport' },
  { name: 'game-controller', label: 'Entertainment' },
  { name: 'home', label: 'Home' },
  { name: 'medical', label: 'Health' },
  { name: 'book', label: 'Education' },
];

export default function ManageBudget() {
  const router = useRouter();
  const { groupId, selectedIcon, selectedIconLabel } = useLocalSearchParams();
  const [budgets, setBudgets] = useState([]);
  const [newBudget, setNewBudget] = useState({
    name: '',
    icon: 'cart',
    amount: ''
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (selectedIcon && selectedIconLabel) {
      setNewBudget(prev => ({
        ...prev,
        icon: selectedIcon
      }));
    }
  }, [selectedIcon, selectedIconLabel]);

  // Mock data - replace with actual API calls
  useEffect(() => {
    setBudgets([
      { id: 1, amount: '1000', date: new Date() },
      { id: 2, amount: '2000', date: new Date() },
    ]);
  }, []);

  const handleAddBudget = () => {
    if (!newBudget.name.trim()) {
      Alert.alert('Error', 'Please enter a budget name');
      return;
    }
    if (!newBudget.amount.trim()) {
      Alert.alert('Error', 'Please enter a budget amount');
      return;
    }

    const amount = parseFloat(newBudget.amount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    const budget = {
      id: Date.now(),
      name: newBudget.name,
      icon: newBudget.icon,
      amount: amount,
      date: new Date()
    };

    setBudgets([budget, ...budgets]);
    setNewBudget({ name: '', icon: 'cart', amount: '' });
    
    // Navigate back after adding budget
    router.back({
      params: { budget: newBudget.amount }
    });
  };

  const handleEditBudget = (id, newAmount) => {
    const amount = parseFloat(newAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    setBudgets(budgets.map(budget => 
      budget.id === id ? { ...budget, amount } : budget
    ));
    setEditingId(null);
    
    // Navigate back after editing budget
    router.back({
      params: { budget: newAmount }
    });
  };

  const handleRemoveBudget = (id) => {
    Alert.alert(
      'Remove Budget',
      'Are you sure you want to remove this budget?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setBudgets(budgets.filter(budget => budget.id !== id));
            // Navigate back after removing budget
            router.back({
              params: { budget: null }
            });
          }
        }
      ]
    );
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

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
          <Text style={styles.headerTitle}>Manage Budget</Text>
        </View>
      </View>

      <View style={styles.addSection}>
        <View style={styles.inputContainer}>
          <Ionicons name="text-outline" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Budget Name"
            value={newBudget.name}
            onChangeText={(text) => setNewBudget(prev => ({ ...prev, name: text }))}
          />
        </View>

        <Pressable 
          style={styles.iconSelector}
          onPress={() => router.push(`/(tabs)/groups/select-icon?selectedIcon=${newBudget.icon}`)}
        >
          <Ionicons name={newBudget.icon} size={24} color={colors.primary} />
          <Text style={styles.iconSelectorText}>
            {selectedIconLabel || 'Select Icon'}
          </Text>
          <Ionicons name="chevron-forward" size={20} color="#666" />
        </Pressable>

        <View style={styles.inputContainer}>
          <Text style={styles.currencySymbol}>$</Text>
          <TextInput
            style={styles.input}
            placeholder="0.00"
            keyboardType="decimal-pad"
            value={newBudget.amount}
            onChangeText={(text) => setNewBudget(prev => ({ ...prev, amount: text }))}
          />
        </View>

        <Pressable
          style={[
            styles.addButton,
            (!newBudget.name.trim() || !newBudget.amount.trim()) && styles.addButtonDisabled
          ]}
          onPress={handleAddBudget}
          disabled={!newBudget.name.trim() || !newBudget.amount.trim()}
        >
          <Ionicons 
            name="add-circle-outline" 
            size={24} 
            color={!newBudget.name.trim() || !newBudget.amount.trim() ? '#999' : colors.primary} 
          />
          <Text style={[
            styles.addButtonText,
            (!newBudget.name.trim() || !newBudget.amount.trim()) && styles.addButtonTextDisabled
          ]}>
            Add Budget
          </Text>
        </Pressable>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Budget History</Text>
        {budgets.map(budget => (
          <View key={budget.id} style={styles.budgetItem}>
            <View style={styles.budgetInfo}>
              <View style={styles.budgetHeader}>
                <View style={styles.budgetIconContainer}>
                  <Ionicons name={budget.icon} size={20} color={colors.primary} />
                </View>
                <Text style={styles.budgetName}>{budget.name}</Text>
              </View>
              <Text style={styles.budgetDate}>{formatDate(budget.date)}</Text>
              {editingId === budget.id ? (
                <View style={styles.editContainer}>
                  <Text style={styles.editCurrencySymbol}>$</Text>
                  <TextInput
                    style={styles.editInput}
                    defaultValue={budget.amount.toString()}
                    keyboardType="decimal-pad"
                    autoFocus
                    onBlur={() => setEditingId(null)}
                    onSubmitEditing={(e) => handleEditBudget(budget.id, e.nativeEvent.text)}
                  />
                </View>
              ) : (
                <Text style={styles.budgetAmount}>${budget.amount}</Text>
              )}
            </View>
            <View style={styles.budgetActions}>
              <Pressable
                style={styles.actionButton}
                onPress={() => setEditingId(budget.id)}
              >
                <Ionicons name="pencil" size={20} color={colors.primary} />
              </Pressable>
              <Pressable
                style={[styles.actionButton, styles.removeButton]}
                onPress={() => handleRemoveBudget(budget.id)}
              >
                <Ionicons name="trash-outline" size={20} color="#ff4444" />
              </Pressable>
            </View>
          </View>
        ))}
      </ScrollView>
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
  addSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    marginBottom: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  iconSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    marginBottom: 12,
  },
  iconSelectorText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  currencySymbol: {
    fontSize: 20,
    color: '#666',
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary + '10',
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  addButtonDisabled: {
    backgroundColor: '#f5f5f5',
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  addButtonTextDisabled: {
    color: '#999',
  },
  content: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  budgetItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  budgetInfo: {
    flex: 1,
  },
  budgetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  budgetIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary + '10',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  budgetName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  budgetDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  budgetAmount: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primary,
  },
  budgetActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionButton: {
    padding: 8,
  },
  removeButton: {
    marginLeft: 4,
  },
  editContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editCurrencySymbol: {
    fontSize: 18,
    color: colors.primary,
    marginRight: 4,
  },
  editInput: {
    fontSize: 18,
    color: colors.primary,
    fontWeight: '600',
    padding: 0,
    minWidth: 80,
  },
}); 