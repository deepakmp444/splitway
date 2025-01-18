import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { useRouter } from 'expo-router';
export default function Friends() {
  const router = useRouter();



  return (
    <View style={styles.container}>
      <View style={styles.subcontainer}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <TouchableOpacity style={styles.addButton}>
            <Ionicons name="filter-outline" size={35} color={'black'} />
          </TouchableOpacity>
          <Text style={{ fontWeight: 'bold' }}>Friends</Text>
          <TouchableOpacity style={styles.addButton}>
            <Ionicons name="add-circle" size={35} />
          </TouchableOpacity>
        </View>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search friends..."
            placeholderTextColor="#666"
            onFocus={() => {
              router.push('/search');
            }}
          />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <TouchableOpacity style={styles.friendCard}>
            <View style={styles.leftSection}>
              <Image
                source={{ uri: "https://picsum.photos/200" }}
                style={styles.avatar}
              />
              <View style={styles.friendInfo}>
                <Text style={styles.friendName}>John Doe</Text>
                <Text style={styles.lastActivity}>Last active 2h ago</Text>
              </View>
            </View>
            <View style={styles.rightSection}>
              <View style={styles.transactionItem}>
                <Text style={styles.transactionAmount}>$120</Text>
                <Text style={[styles.transactionLabel, {color: '#e74c3c'}]}>lent</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.transactionItem}>
                <Text style={styles.transactionAmount}>$80</Text>
                <Text style={[styles.transactionLabel, {color: '#3498db'}]}>borrowed</Text>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.friendCard}>
            <View style={styles.leftSection}>
              <Image
                source={{ uri: "https://picsum.photos/200" }}
                style={styles.avatar}
              />
              <View style={styles.friendInfo}>
                <Text style={styles.friendName}>John Doe</Text>
                <Text style={styles.lastActivity}>Last active 2h ago</Text>
              </View>
            </View>
            <View style={styles.rightSection}>
              <View style={styles.transactionItem}>
                <Text style={styles.transactionAmount}>$120</Text>
                <Text style={[styles.transactionLabel, {color: '#e74c3c'}]}>lent</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.transactionItem}>
                <Text style={styles.transactionAmount}>$80</Text>
                <Text style={[styles.transactionLabel, {color: '#3498db'}]}>borrowed</Text>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.friendCard}>
            <View style={styles.leftSection}>
              <Image
                source={{ uri: "https://picsum.photos/200" }}
                style={styles.avatar}
              />
              <View style={styles.friendInfo}>
                <Text style={styles.friendName}>John Doe</Text>
                <Text style={styles.lastActivity}>Last active 2h ago</Text>
              </View>
            </View>
            <View style={styles.rightSection}>
              <View style={styles.transactionItem}>
                <Text style={styles.transactionAmount}>$120</Text>
                <Text style={[styles.transactionLabel, {color: '#e74c3c'}]}>lent</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.transactionItem}>
                <Text style={styles.transactionAmount}>$80</Text>
                <Text style={[styles.transactionLabel, {color: '#3498db'}]}>borrowed</Text>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.friendCard}>
            <View style={styles.leftSection}>
              <Image
                source={{ uri: "https://picsum.photos/200" }}
                style={styles.avatar}
              />
              <View style={styles.friendInfo}>
                <Text style={styles.friendName}>John Doe</Text>
                <Text style={styles.lastActivity}>Last active 2h ago</Text>
              </View>
            </View>
            <View style={styles.rightSection}>
              <View style={styles.transactionItem}>
                <Text style={styles.transactionAmount}>$120</Text>
                <Text style={[styles.transactionLabel, {color: '#e74c3c'}]}>lent</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.transactionItem}>
                <Text style={styles.transactionAmount}>$80</Text>
                <Text style={[styles.transactionLabel, {color: '#3498db'}]}>borrowed</Text>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.friendCard}>
            <View style={styles.leftSection}>
              <Image
                source={{ uri: "https://picsum.photos/200" }}
                style={styles.avatar}
              />
              <View style={styles.friendInfo}>
                <Text style={styles.friendName}>John Doe</Text>
                <Text style={styles.lastActivity}>Last active 2h ago</Text>
              </View>
            </View>
            <View style={styles.rightSection}>
              <View style={styles.transactionItem}>
                <Text style={styles.transactionAmount}>$120</Text>
                <Text style={[styles.transactionLabel, {color: '#e74c3c'}]}>lent</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.transactionItem}>
                <Text style={styles.transactionAmount}>$80</Text>
                <Text style={[styles.transactionLabel, {color: '#3498db'}]}>borrowed</Text>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.friendCard}>
            <View style={styles.leftSection}>
              <Image
                source={{ uri: "https://picsum.photos/200" }}
                style={styles.avatar}
              />
              <View style={styles.friendInfo}>
                <Text style={styles.friendName}>John Doe</Text>
                <Text style={styles.lastActivity}>Last active 2h ago</Text>
              </View>
            </View>
            <View style={styles.rightSection}>
              <View style={styles.transactionItem}>
                <Text style={styles.transactionAmount}>$120</Text>
                <Text style={[styles.transactionLabel, {color: '#e74c3c'}]}>lent</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.transactionItem}>
                <Text style={styles.transactionAmount}>$80</Text>
                <Text style={[styles.transactionLabel, {color: '#3498db'}]}>borrowed</Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.friendCard}>
            <View style={styles.leftSection}>
              <Image
                source={{ uri: "https://picsum.photos/200" }}
                style={styles.avatar}
              />
              <View style={styles.friendInfo}>
                <Text style={styles.friendName}>John Doe</Text>
                <Text style={styles.lastActivity}>Last active 2h ago</Text>
              </View>
            </View>
            <View style={styles.rightSection}>
              <View style={styles.transactionItem}>
                <Text style={styles.transactionAmount}>$120</Text>
                <Text style={[styles.transactionLabel, {color: '#e74c3c'}]}>lent</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.transactionItem}>
                <Text style={styles.transactionAmount}>$80</Text>
                <Text style={[styles.transactionLabel, {color: '#3498db'}]}>borrowed</Text>
              </View>
            </View>
          </TouchableOpacity><TouchableOpacity style={styles.friendCard}>
            <View style={styles.leftSection}>
              <Image
                source={{ uri: "https://picsum.photos/200" }}
                style={styles.avatar}
              />
              <View style={styles.friendInfo}>
                <Text style={styles.friendName}>John Doe</Text>
                <Text style={styles.lastActivity}>Last active 2h ago</Text>
              </View>
            </View>
            <View style={styles.rightSection}>
              <View style={styles.transactionItem}>
                <Text style={styles.transactionAmount}>$120</Text>
                <Text style={[styles.transactionLabel, {color: '#e74c3c'}]}>lent</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.transactionItem}>
                <Text style={styles.transactionAmount}>$80</Text>
                <Text style={[styles.transactionLabel, {color: '#3498db'}]}>borrowed</Text>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.friendCard}>
            <View style={styles.leftSection}>
              <Image
                source={{ uri: "https://picsum.photos/200" }}
                style={styles.avatar}
              />
              <View style={styles.friendInfo}>
                <Text style={styles.friendName}>John Doe</Text>
                <Text style={styles.lastActivity}>Last active 2h ago</Text>
              </View>
            </View>
            <View style={styles.rightSection}>
              <View style={styles.transactionItem}>
                <Text style={styles.transactionAmount}>$120</Text>
                <Text style={[styles.transactionLabel, {color: '#e74c3c'}]}>lent</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.transactionItem}>
                <Text style={styles.transactionAmount}>$80</Text>
                <Text style={[styles.transactionLabel, {color: '#3498db'}]}>borrowed</Text>
              </View>
            </View>
          </TouchableOpacity><TouchableOpacity style={styles.friendCard}>
            <View style={styles.leftSection}>
              <Image
                source={{ uri: "https://picsum.photos/200" }}
                style={styles.avatar}
              />
              <View style={styles.friendInfo}>
                <Text style={styles.friendName}>John Doe</Text>
                <Text style={styles.lastActivity}>Last active 2h ago</Text>
              </View>
            </View>
            <View style={styles.rightSection}>
              <View style={styles.transactionItem}>
                <Text style={styles.transactionAmount}>$120</Text>
                <Text style={[styles.transactionLabel, {color: '#e74c3c'}]}>lent</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.transactionItem}>
                <Text style={styles.transactionAmount}>$80</Text>
                <Text style={[styles.transactionLabel, {color: '#3498db'}]}>borrowed</Text>
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
  friendCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 12,
    marginVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 23,
  },
  friendInfo: {
    marginLeft: 12,
  },
  friendName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  lastActivity: {
    fontSize: 13,
    color: '#666',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  transactionItem: {
    alignItems: 'center',
  },
  transactionAmount: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  transactionLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: '80%',
    backgroundColor: '#E5E5E5',
  },
}); 