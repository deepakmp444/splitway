import { View, Text, StyleSheet, TextInput, Pressable, ScrollView, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../util/constant';

export default function ManageBudget() {
  const router = useRouter();
  const { groupId } = useLocalSearchParams();
  const [budgets, setBudgets] = useState([]);
  const [newBudget, setNewBudget] = useState('');
  const [editingId, setEditingId] = useState(null);

  // Mock data - replace with actual API calls
  useEffect(() => {
    setBudgets([
      { id: 1, amount: '1000', date: new Date() },
      { id: 2, amount: '2000', date: new Date() },
    ]);
  }, []);

  const handleAddBudget = () => {
    if (!newBudget || isNaN(parseFloat(newBudget))) {
      Alert.alert('Invalid Amount', 'Please enter a valid budget amount');
      return;
    }

    setBudgets(prev => [
      ...prev,
      {
        id: Date.now(),
        amount: newBudget,
        date: new Date()
      }
    ]);
    setNewBudget('');
  };

  const handleEditBudget = (id, newAmount) => {
    if (!newAmount || isNaN(parseFloat(newAmount))) {
      Alert.alert('Invalid Amount', 'Please enter a valid budget amount');
      return;
    }

    setBudgets(prev =>
      prev.map(budget =>
        budget.id === id
          ? { ...budget, amount: newAmount }
          : budget
      )
    );
    setEditingId(null);
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
            setBudgets(prev => prev.filter(budget => budget.id !== id));
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
          <Text style={styles.currencySymbol}>$</Text>
          <TextInput
            style={styles.input}
            value={newBudget}
            onChangeText={setNewBudget}
            placeholder="Enter budget amount"
            keyboardType="decimal-pad"
            returnKeyType="done"
          />
        </View>
        <Pressable 
          style={[styles.addButton, !newBudget && styles.addButtonDisabled]}
          onPress={handleAddBudget}
          disabled={!newBudget}
        >
          <Ionicons name="add-circle" size={24} color={newBudget ? colors.primary : '#ccc'} />
          <Text style={[styles.addButtonText, !newBudget && styles.addButtonTextDisabled]}>
            Add Budget
          </Text>
        </Pressable>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Budget History</Text>
        {budgets.map(budget => (
          <View key={budget.id} style={styles.budgetItem}>
            <View style={styles.budgetInfo}>
              <Text style={styles.budgetDate}>{formatDate(budget.date)}</Text>
              {editingId === budget.id ? (
                <View style={styles.editContainer}>
                  <Text style={styles.editCurrencySymbol}>$</Text>
                  <TextInput
                    style={styles.editInput}
                    defaultValue={budget.amount}
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
  currencySymbol: {
    fontSize: 20,
    color: '#666',
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 20,
    color: colors.primary,
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