import { View, Text, StyleSheet, TextInput, ScrollView, Pressable, Modal, FlatList, Image } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../util/constant';
import { SafeAreaView } from 'react-native-safe-area-context';

// Predefined expense categories with icons
const expenseCategories = [
  { id: 'food', name: 'Food & Drinks', icon: 'restaurant', color: '#FF9800' },
  { id: 'transport', name: 'Transport', icon: 'car', color: '#2196F3' },
  { id: 'shopping', name: 'Shopping', icon: 'cart', color: '#4CAF50' },
  { id: 'entertainment', name: 'Entertainment', icon: 'game-controller', color: '#9C27B0' },
  { id: 'health', name: 'Health', icon: 'medical', color: '#F44336' },
  { id: 'travel', name: 'Travel', icon: 'airplane', color: '#03A9F4' },
  { id: 'education', name: 'Education', icon: 'school', color: '#FF5722' },
  { id: 'bills', name: 'Bills', icon: 'receipt', color: '#795548' },
  { id: 'others', name: 'Others', icon: 'grid', color: '#607D8B' },
];

const splitMethods = [
  { id: 'equal', name: 'Split Equally', icon: 'people' },
  { id: 'unequal', name: 'Split Unequally', icon: 'git-compare' },
  { id: 'percent', name: 'Split by Percentage', icon: 'pie-chart' },
];

export default function AddExpense() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { groupId } = params;

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const [expenseName, setExpenseName] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  
  // State for payer and split info
  const [payer, setPayer] = useState({ id: 1, name: 'You' });
  const [splitMethod, setSplitMethod] = useState('equal');
  const [splitDetails, setSplitDetails] = useState(null);

  // State for image selection
  const [selectedImage, setSelectedImage] = useState(null);

  // Update payer when returning from select-payer screen
  useEffect(() => {
    if (params.payerId && params.payerName) {
      setPayer({
        id: parseInt(params.payerId),
        name: params.payerName
      });
    }
  }, [params.payerId, params.payerName]);

  // Update split details when returning from split-expense screen
  useEffect(() => {
    if (params.splitMethod) {
      setSplitMethod(params.splitMethod);
      setSplitDetails({
        shares: params.shares,
        selectedMembers: params.selectedMembers
      });
    }
  }, [params.splitMethod, params.shares, params.selectedMembers]);

  // Update image selection
  useEffect(() => {
    if (params?.imageUri) {
      setSelectedImage(params.imageUri);
    }
  }, [params?.imageUri]);

  const handleSave = () => {
    // Implement save logic here
    router.back();
  };

  const renderCategoryModal = () => (
    <Modal
      visible={isCategoryModalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setIsCategoryModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Category</Text>
            <Pressable 
              onPress={() => setIsCategoryModalVisible(false)}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={24} color="#666" />
            </Pressable>
          </View>
          <View style={styles.categoriesGrid}>
            {expenseCategories.map((category) => (
              <Pressable
                key={category.id}
                style={[
                  styles.categoryItem,
                  selectedCategory?.id === category.id && styles.selectedCategoryItem
                ]}
                onPress={() => {
                  setSelectedCategory(category);
                  setIsCategoryModalVisible(false);
                }}
              >
                <View style={[styles.categoryIcon, { backgroundColor: category.color + '20' }]}>
                  <Ionicons name={category.icon} size={24} color={category.color} />
                </View>
                <Text style={styles.categoryName}>{category.name}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="close" size={24} color="black" />
        </Pressable>
        <Text style={styles.headerTitle}>Add Expense</Text>
        <Pressable 
          style={[styles.saveButton, (!expenseName || !amount || !selectedCategory) && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={!expenseName || !amount || !selectedCategory}
        >
          <Text style={[
            styles.saveButtonText,
            (!expenseName || !amount || !selectedCategory) && styles.saveButtonTextDisabled
          ]}>Save</Text>
        </Pressable>
      </View>

      <ScrollView style={styles.content}>
        {/* Category Selection */}
        <Pressable
          style={styles.categorySelector}
          onPress={() => setIsCategoryModalVisible(true)}
        >
          {selectedCategory ? (
            <View style={styles.selectedCategoryContainer}>
              <View style={[styles.selectedCategoryIcon, { backgroundColor: selectedCategory.color + '20' }]}>
                <Ionicons name={selectedCategory.icon} size={32} color={selectedCategory.color} />
              </View>
              <Text style={styles.selectedCategoryName}>{selectedCategory.name}</Text>
            </View>
          ) : (
            <View style={styles.categoryPlaceholder}>
              <Ionicons name="grid" size={32} color="#666" />
              <Text style={styles.categoryPlaceholderText}>Select Category</Text>
            </View>
          )}
        </Pressable>

        {/* Expense Details */}
        <View style={styles.inputSection}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Expense Name</Text>
            <TextInput
              style={styles.input}
              placeholder="What was this expense for?"
              value={expenseName}
              onChangeText={setExpenseName}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Amount</Text>
            <TextInput
              style={styles.input}
              placeholder="0.00"
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Paid By</Text>
            <Pressable 
              style={styles.paidBySelector}
              onPress={() => router.push(`/select-payer?groupId=${groupId}`)}
            >
              <Text style={styles.paidByText}>{payer.name}</Text>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </Pressable>
          </View>

          {/* Split Method Selection */}
          <View style={styles.splitMethodSection}>
            <Text style={styles.sectionTitle}>Split Details</Text>
            <Pressable 
              style={styles.splitDetailsButton}
              onPress={() => router.push(`/split-expense?groupId=${groupId}&amount=${amount}`)}
            >
              <View style={styles.splitInfo}>
                <Text style={styles.splitMethodName}>
                  {splitMethod === 'equal' ? 'Split Equally' :
                   splitMethod === 'unequal' ? 'Split Unequally' :
                   'Split by Percentage'}
                </Text>
                {splitDetails && (
                  <Text style={styles.splitSummary}>
                    {Object.values(splitDetails.selectedMembers).filter(Boolean).length} members
                  </Text>
                )}
              </View>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </Pressable>
          </View>

          {/* Note Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Note (Optional)</Text>
            <TextInput
              style={[styles.input, styles.noteInput]}
              placeholder="Add a note"
              value={note}
              onChangeText={setNote}
              multiline
            />
          </View>

          {/* Image Selection */}
          <Pressable 
            style={styles.imageSelector}
            onPress={() => router.push('/(tabs)/groups/select-image')}
          >
            {selectedImage ? (
              <View style={styles.selectedImageContainer}>
                <Image 
                  source={{ uri: selectedImage }} 
                  style={styles.selectedImage} 
                  resizeMode="cover"
                />
                <Pressable 
                  style={styles.removeImageButton}
                  onPress={() => setSelectedImage(null)}
                >
                  <Ionicons name="close-circle" size={24} color="#fff" />
                </Pressable>
              </View>
            ) : (
              <View style={styles.imagePlaceholder}>
                <Ionicons name="camera" size={24} color={colors.primary} />
                <Text style={styles.imagePlaceholderText}>Add Receipt Photo</Text>
              </View>
            )}
          </Pressable>
        </View>
      </ScrollView>

      {renderCategoryModal()}
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
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  saveButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: colors.primary,
  },
  saveButtonDisabled: {
    backgroundColor: '#ccc',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  saveButtonTextDisabled: {
    color: '#666',
  },
  content: {
    flex: 1,
  },
  categorySelector: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  selectedCategoryContainer: {
    alignItems: 'center',
  },
  selectedCategoryIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  selectedCategoryName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1a1a1a',
  },
  categoryPlaceholder: {
    alignItems: 'center',
  },
  categoryPlaceholderText: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
  inputSection: {
    padding: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  noteInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  paidBySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
  },
  paidByText: {
    fontSize: 16,
  },
  splitMethodSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  splitDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  splitInfo: {
    flex: 1,
  },
  splitMethodName: {
    fontSize: 16,
    marginBottom: 4,
  },
  splitSummary: {
    fontSize: 14,
    color: '#666',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    paddingBottom: 20,
  },
  categoryItem: {
    width: '29%',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  selectedCategoryItem: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    textAlign: 'center',
    color: '#666',
  },
  imageSelector: {
    marginTop: 16,
    marginBottom: 16,
  },
  imagePlaceholder: {
    height: 120,
    backgroundColor: colors.primary + '10',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.primary + '20',
    borderStyle: 'dashed',
  },
  imagePlaceholderText: {
    marginTop: 8,
    fontSize: 14,
    color: colors.primary,
  },
  selectedImageContainer: {
    position: 'relative',
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
  },
  selectedImage: {
    width: '100%',
    height: '100%',
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 12,
  },
}); 