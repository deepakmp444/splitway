import { View, Text, StyleSheet, Pressable, Switch, Alert, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../util/constant';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useState } from 'react';

export default function ChatSettings() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [notifications, setNotifications] = useState(true);
  const [pinned, setPinned] = useState(false);

  const handleBlock = () => {
    Alert.alert(
      'Block Contact',
      `Are you sure you want to block ${params.name}? You won't be able to receive messages or split expenses with them.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Block',
          style: 'destructive',
          onPress: () => {
            // TODO: Implement block functionality
            console.log('Block user:', params.id);
            // Navigate back to friends screen
            router.push('/(tabs)/friends');
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleRemoveFriend = () => {
    Alert.alert(
      'Remove Friend',
      `Are you sure you want to remove ${params.name} from your friends? All shared expenses will be preserved.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            // TODO: Implement remove friend functionality
            console.log('Remove friend:', params.id);
            // Navigate back to friends screen
            router.push('/(tabs)/friends');
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleClearChat = () => {
    Alert.alert(
      'Clear Chat History',
      'Are you sure you want to clear all messages? This cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            // TODO: Implement clear chat functionality
            console.log('Clear chat with:', params.id);
            router.back();
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleReport = () => {
    Alert.alert(
      'Report User',
      'Are you sure you want to report this user for inappropriate behavior?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Report',
          style: 'destructive',
          onPress: () => {
            // TODO: Implement report functionality
            console.log('Report user:', params.id);
            router.push('/(tabs)/friends');
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable 
          style={styles.iconButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </Pressable>
        <Text style={styles.title}>Chat Settings</Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* User Info */}
        <View style={styles.userInfo}>
          <Image
            source={params.avatar}
            style={styles.avatar}
            contentFit="cover"
            transition={1000}
          />
          <Text style={styles.userName}>{params.name}</Text>
          <Text style={styles.userUsername}>{params.username}</Text>
        </View>

        {/* Settings Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>General Settings</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={styles.iconContainer}>
                <Ionicons name="notifications" size={22} color={colors.primary} />
              </View>
              <Text style={styles.settingText}>Notifications</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: '#E5E5E5', true: `${colors.primary}50` }}
              thumbColor={notifications ? colors.primary : '#fff'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={styles.iconContainer}>
                <Ionicons name="pin" size={22} color={colors.primary} />
              </View>
              <Text style={styles.settingText}>Pin Conversation</Text>
            </View>
            <Switch
              value={pinned}
              onValueChange={setPinned}
              trackColor={{ false: '#E5E5E5', true: `${colors.primary}50` }}
              thumbColor={pinned ? colors.primary : '#fff'}
            />
          </View>
        </View>

        {/* Shared Content */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shared Content</Text>

          <Pressable 
            style={styles.settingItem}
            onPress={() => router.push({
              pathname: '/shared-expenses',
              params: {
                id: params.id,
                name: params.name,
                balance: params.balance
              }
            })}
          >
            <View style={styles.settingLeft}>
              <View style={styles.iconContainer}>
                <Ionicons name="receipt" size={22} color={colors.primary} />
              </View>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingText}>Shared Expenses</Text>
                <Text style={styles.settingSubtext}>View all expenses shared with {params.name}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#666" />
          </Pressable>

          <Pressable 
            style={styles.settingItem}
            onPress={() => router.push({
              pathname: '/shared-groups',
              params: {
                id: params.id,
                name: params.name
              }
            })}
          >
            <View style={styles.settingLeft}>
              <View style={styles.iconContainer}>
                <Ionicons name="people" size={22} color={colors.primary} />
              </View>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingText}>Shared Groups</Text>
                <Text style={styles.settingSubtext}>View groups you share with {params.name}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#666" />
          </Pressable>
        </View>

        {/* Danger Zone */}
        <View style={[styles.section, styles.dangerSection]}>
          <Text style={[styles.sectionTitle, { color: '#ff0000' }]}>Danger Zone</Text>
          
          <Pressable 
            style={styles.settingItem}
            onPress={handleClearChat}
          >
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, { backgroundColor: '#66666615' }]}>
                <Ionicons name="trash" size={22} color="#666" />
              </View>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingText}>Clear Chat History</Text>
                <Text style={styles.settingSubtext}>Delete all messages in this conversation</Text>
              </View>
            </View>
          </Pressable>

          <Pressable 
            style={styles.settingItem}
            onPress={handleRemoveFriend}
          >
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, { backgroundColor: '#ff000015' }]}>
                <Ionicons name="person-remove" size={22} color="#ff0000" />
              </View>
              <View style={styles.settingTextContainer}>
                <Text style={[styles.settingText, { color: '#ff0000' }]}>Remove Friend</Text>
                <Text style={styles.settingSubtext}>Remove from friends but keep shared history</Text>
              </View>
            </View>
          </Pressable>

          <Pressable 
            style={styles.settingItem}
            onPress={handleBlock}
          >
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, { backgroundColor: '#ff000015' }]}>
                <Ionicons name="ban" size={22} color="#ff0000" />
              </View>
              <View style={styles.settingTextContainer}>
                <Text style={[styles.settingText, { color: '#ff0000' }]}>Block Contact</Text>
                <Text style={styles.settingSubtext}>Block messages and future requests</Text>
              </View>
            </View>
          </Pressable>

          <Pressable 
            style={[styles.settingItem, styles.lastItem]}
            onPress={handleReport}
          >
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, { backgroundColor: '#ff000015' }]}>
                <Ionicons name="flag" size={22} color="#ff0000" />
              </View>
              <View style={styles.settingTextContainer}>
                <Text style={[styles.settingText, { color: '#ff0000' }]}>Report User</Text>
                <Text style={styles.settingSubtext}>Report inappropriate behavior</Text>
              </View>
            </View>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9faf9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${colors.primary}15`,
    marginRight: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  userInfo: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
    borderWidth: 3,
    borderColor: `${colors.primary}30`,
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  userUsername: {
    fontSize: 16,
    color: '#666',
  },
  section: {
    backgroundColor: 'white',
    marginTop: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E5E5E5',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    padding: 16,
    paddingBottom: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${colors.primary}15`,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingText: {
    fontSize: 16,
    color: '#000',
    marginBottom: 2,
  },
  settingSubtext: {
    fontSize: 13,
    color: '#666',
  },
  dangerSection: {
    marginTop: 32,
  },
}); 