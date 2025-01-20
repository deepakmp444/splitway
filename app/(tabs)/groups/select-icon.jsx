import { View, Text, StyleSheet, TextInput, Pressable, FlatList } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState, useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../../util/constant';

// This will be expanded to 100+ icons later
const iconCategories = [
  {
    name: 'Common',
    icons: [
      { name: 'cart', label: 'Shopping' },
      { name: 'restaurant', label: 'Food' },
      { name: 'airplane', label: 'Travel' },
      { name: 'car', label: 'Transport' },
      { name: 'game-controller', label: 'Entertainment' },
      { name: 'home', label: 'Home' },
      { name: 'medical', label: 'Health' },
      { name: 'book', label: 'Education' },
    ]
  },
  {
    name: 'Activities',
    icons: [
      { name: 'fitness', label: 'Fitness' },
      { name: 'basketball', label: 'Sports' },
      { name: 'musical-notes', label: 'Music' },
      { name: 'film', label: 'Movies' },
    ]
  },
  {
    name: 'Finance',
    icons: [
      { name: 'wallet', label: 'Wallet' },
      { name: 'card', label: 'Credit Card' },
      { name: 'cash', label: 'Cash' },
      { name: 'trending-up', label: 'Investment' },
    ]
  }
];

export default function SelectIcon() {
  const router = useRouter();
  const { selectedIcon } = useLocalSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredIcons = useCallback(() => {
    let icons = [];
    
    // Collect all icons if no category is selected or "All" is selected
    if (selectedCategory === 'All') {
      icons = iconCategories.flatMap(category => category.icons);
    } else {
      // Get icons from selected category
      const category = iconCategories.find(c => c.name === selectedCategory);
      icons = category ? category.icons : [];
    }

    // Filter by search query if present
    if (searchQuery) {
      return icons.filter(icon => 
        icon.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        icon.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return icons;
  }, [searchQuery, selectedCategory]);

  const handleSelectIcon = (icon) => {
    router.back({
      params: { selectedIcon: icon.name, selectedIconLabel: icon.label }
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
          <Text style={styles.headerTitle}>Select Icon</Text>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search icons..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <Pressable onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#666" />
            </Pressable>
          ) : null}
        </View>
      </View>

      <View style={styles.categoriesContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={['All', ...iconCategories.map(c => c.name)]}
          keyExtractor={item => item}
          renderItem={({ item }) => (
            <Pressable
              style={[
                styles.categoryChip,
                selectedCategory === item && styles.selectedCategoryChip
              ]}
              onPress={() => setSelectedCategory(item)}
            >
              <Text style={[
                styles.categoryChipText,
                selectedCategory === item && styles.selectedCategoryChipText
              ]}>
                {item}
              </Text>
            </Pressable>
          )}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      <FlatList
        data={filteredIcons()}
        numColumns={4}
        keyExtractor={(item) => item.name}
        contentContainerStyle={styles.iconGrid}
        renderItem={({ item }) => (
          <Pressable
            style={[
              styles.iconOption,
              item.name === selectedIcon && styles.selectedIconOption
            ]}
            onPress={() => handleSelectIcon(item)}
          >
            <View style={[
              styles.iconContainer,
              item.name === selectedIcon && styles.selectedIconContainer
            ]}>
              <Ionicons 
                name={item.name} 
                size={28} 
                color={item.name === selectedIcon ? 'white' : colors.primary} 
              />
            </View>
            <Text style={[
              styles.iconLabel,
              item.name === selectedIcon && styles.selectedIconLabel
            ]}>
              {item.label}
            </Text>
          </Pressable>
        )}
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
  searchContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  categoriesContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  categoriesList: {
    padding: 16,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    marginRight: 8,
  },
  selectedCategoryChip: {
    backgroundColor: colors.primary,
  },
  categoryChipText: {
    fontSize: 14,
    color: '#666',
  },
  selectedCategoryChipText: {
    color: 'white',
    fontWeight: '500',
  },
  iconGrid: {
    padding: 16,
  },
  iconOption: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    minWidth: '25%',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary + '10',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  selectedIconContainer: {
    backgroundColor: colors.primary,
  },
  iconLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  selectedIconLabel: {
    color: colors.primary,
    fontWeight: '500',
  },
}); 