import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { useRouter } from 'expo-router';
export default function Groups() {
  const router = useRouter();


  return (
    <View style={styles.container}>
      <View style={styles.subcontainer}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <TouchableOpacity style={styles.addButton}>
            <Ionicons name="filter-outline" size={35} color={'black'} />
          </TouchableOpacity>
          <Text style={{ fontWeight: 'bold' }}>Groups</Text>
          <TouchableOpacity style={styles.addButton}>
            <Ionicons name="add-circle" size={35} />
          </TouchableOpacity>
        </View>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search groups..."
            placeholderTextColor="#666"
            onFocus={() => {
              router.push('/search');
            }}
          />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Sample Group Card - You can map through your groups data here */}
          <TouchableOpacity style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: "https://picsum.photos/200" }}
                  style={styles.groupImage}
                />
                <View style={[styles.statusDot, { backgroundColor: '#2ecc71' }]} />
              </View>
              <View style={styles.groupInfo}>
                <Text style={styles.groupName}>Weekend Trip</Text>
                <Text style={styles.membersText}>4 members</Text>
              </View>
            </View>
            
            <View style={styles.financialInfo}>
              <View style={styles.financeItem}>
                <Text style={styles.financeLabel}>Lent</Text>
                <Text style={styles.financeAmount}>$120</Text>
              </View>
              <View style={styles.financeItem}>
                <Text style={styles.financeLabel}>Spent</Text>
                <Text style={styles.financeAmount}>$250</Text>
              </View>
              <View style={styles.financeItem}>
                <Text style={styles.financeLabel}>Borrowed</Text>
                <Text style={styles.financeAmount}>$80</Text>
              </View>
              <View style={styles.financeItem}>
                <Text style={[styles.financeLabel, {fontWeight: 'bold'}]}>Balance</Text>
                <Text style={[styles.financeAmount, {color: '#2ecc71'}]}>+$40</Text>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: "https://picsum.photos/200" }}
                  style={styles.groupImage}
                />
                <View style={[styles.statusDot, { backgroundColor: '#2ecc71' }]} />
              </View>
              <View style={styles.groupInfo}>
                <Text style={styles.groupName}>Weekend Trip</Text>
                <Text style={styles.membersText}>4 members</Text>
              </View>
            </View>
            
            <View style={styles.financialInfo}>
              <View style={styles.financeItem}>
                <Text style={styles.financeLabel}>Lent</Text>
                <Text style={styles.financeAmount}>$120</Text>
              </View>
              <View style={styles.financeItem}>
                <Text style={styles.financeLabel}>Spent</Text>
                <Text style={styles.financeAmount}>$250</Text>
              </View>
              <View style={styles.financeItem}>
                <Text style={styles.financeLabel}>Borrowed</Text>
                <Text style={styles.financeAmount}>$80</Text>
              </View>
              <View style={styles.financeItem}>
                <Text style={[styles.financeLabel, {fontWeight: 'bold'}]}>Balance</Text>
                <Text style={[styles.financeAmount, {color: '#2ecc71'}]}>+$40</Text>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: "https://picsum.photos/200" }}
                  style={styles.groupImage}
                />
                <View style={[styles.statusDot, { backgroundColor: '#2ecc71' }]} />
              </View>
              <View style={styles.groupInfo}>
                <Text style={styles.groupName}>Weekend Trip</Text>
                <Text style={styles.membersText}>4 members</Text>
              </View>
            </View>
            
            <View style={styles.financialInfo}>
              <View style={styles.financeItem}>
                <Text style={styles.financeLabel}>Lent</Text>
                <Text style={styles.financeAmount}>$120</Text>
              </View>
              <View style={styles.financeItem}>
                <Text style={styles.financeLabel}>Spent</Text>
                <Text style={styles.financeAmount}>$250</Text>
              </View>
              <View style={styles.financeItem}>
                <Text style={styles.financeLabel}>Borrowed</Text>
                <Text style={styles.financeAmount}>$80</Text>
              </View>
              <View style={styles.financeItem}>
                <Text style={[styles.financeLabel, {fontWeight: 'bold'}]}>Balance</Text>
                <Text style={[styles.financeAmount, {color: '#2ecc71'}]}>+$40</Text>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: "https://picsum.photos/200" }}
                  style={styles.groupImage}
                />
                <View style={[styles.statusDot, { backgroundColor: '#2ecc71' }]} />
              </View>
              <View style={styles.groupInfo}>
                <Text style={styles.groupName}>Weekend Trip</Text>
                <Text style={styles.membersText}>4 members</Text>
              </View>
            </View>
            
            <View style={styles.financialInfo}>
              <View style={styles.financeItem}>
                <Text style={styles.financeLabel}>Lent</Text>
                <Text style={styles.financeAmount}>$120</Text>
              </View>
              <View style={styles.financeItem}>
                <Text style={styles.financeLabel}>Spent</Text>
                <Text style={styles.financeAmount}>$250</Text>
              </View>
              <View style={styles.financeItem}>
                <Text style={styles.financeLabel}>Borrowed</Text>
                <Text style={styles.financeAmount}>$80</Text>
              </View>
              <View style={styles.financeItem}>
                <Text style={[styles.financeLabel, {fontWeight: 'bold'}]}>Balance</Text>
                <Text style={[styles.financeAmount, {color: '#2ecc71'}]}>+$40</Text>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: "https://picsum.photos/200" }}
                  style={styles.groupImage}
                />
                <View style={[styles.statusDot, { backgroundColor: '#2ecc71' }]} />
              </View>
              <View style={styles.groupInfo}>
                <Text style={styles.groupName}>Weekend Trip</Text>
                <Text style={styles.membersText}>4 members</Text>
              </View>
            </View>
            
            <View style={styles.financialInfo}>
              <View style={styles.financeItem}>
                <Text style={styles.financeLabel}>Lent</Text>
                <Text style={styles.financeAmount}>$120</Text>
              </View>
              <View style={styles.financeItem}>
                <Text style={styles.financeLabel}>Spent</Text>
                <Text style={styles.financeAmount}>$250</Text>
              </View>
              <View style={styles.financeItem}>
                <Text style={styles.financeLabel}>Borrowed</Text>
                <Text style={styles.financeAmount}>$80</Text>
              </View>
              <View style={styles.financeItem}>
                <Text style={[styles.financeLabel, {fontWeight: 'bold'}]}>Balance</Text>
                <Text style={[styles.financeAmount, {color: '#2ecc71'}]}>+$40</Text>
              </View>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "white",
  },
  subcontainer: {
    flex: 1,
    backgroundColor: "#f9faf9",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    // padding: 10,?
    paddingHorizontal: 10,
    paddingTop: 20,
  },

  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 10,
  },
  searchInput: {
    flex: 1,
    height: 44,
    backgroundColor: 'white',
    borderRadius: 22,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  addButton: {
    padding: 5,
    borderRadius: 8,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginVertical: 8,
    borderColor: '#E5E5E5',
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  imageContainer: {
    position: 'relative',
  },
  groupImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderWidth: 2,
    borderColor: 'white',
  },
  groupInfo: {
    marginLeft: 15,
  },
  groupName: {
    fontSize: 18,
    fontWeight: '600',
  },
  membersText: {
    color: '#666',
    fontSize: 14,
  },
  financialInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 15,
  },
  financeItem: {
    alignItems: 'center',
  },
  financeLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  financeAmount: {
    fontSize: 14,
    fontWeight: '500',
  },
}); 