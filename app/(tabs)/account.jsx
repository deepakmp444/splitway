import { View, Text, StyleSheet, ScrollView, Pressable, Switch } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../util/constant';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Account() {
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(false);

  const userProfile = {
    name: 'Deepak Kumar',
    email: 'deepak@example.com',
    phone: '+91 9876543210',
    joinedDate: 'March 2024',
    totalGroups: 4,
    totalFriends: 8,
    profileComplete: 85,
  };

  const accountStats = [
    {
      title: 'Total Spent',
      value: '$2,450',
      icon: 'wallet',
      color: '#FF7F50',
    },
    {
      title: "You'll Get",
      value: '$450',
      icon: 'arrow-up',
      color: '#38b000',
    },
    {
      title: "You'll Pay",
      value: '$205',
      icon: 'arrow-down',
      color: '#ff0000',
    },
  ];

  const menuSections = [
    {
      title: 'Account Settings',
      items: [
        {
          icon: 'person-circle',
          label: 'Edit Profile',
          onPress: () => router.push('/edit-profile'),
          showArrow: true,
        },
        {
          icon: 'lock-closed',
          label: 'Change Password',
          onPress: () => router.push('/change-password'),
          showArrow: true,
        },
        {
          icon: 'language',
          label: 'Language',
          value: 'English',
          onPress: () => router.push('/language'),
          showArrow: true,
        },
      ],
    },
    {
      title: 'Preferences',
      items: [
        {
          icon: 'notifications',
          label: 'Notifications',
          isToggle: true,
          value: notificationsEnabled,
          onToggle: setNotificationsEnabled,
        },
        {
          icon: 'finger-print',
          label: 'Biometric Login',
          isToggle: true,
          value: biometricEnabled,
          onToggle: setBiometricEnabled,
        },
        {
          icon: 'color-palette',
          label: 'Theme',
          value: 'Light',
          onPress: () => router.push('/theme'),
          showArrow: true,
        },
      ],
    },
    {
      title: 'Payment',
      items: [
        {
          icon: 'card',
          label: 'Payment Methods',
          onPress: () => router.push('/payment-methods'),
          showArrow: true,
        },
        {
          icon: 'receipt',
          label: 'Transaction History',
          onPress: () => router.push('/transactions'),
          showArrow: true,
        },
        {
          icon: 'download',
          label: 'Export Data',
          onPress: () => router.push('/export'),
          showArrow: true,
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          icon: 'help-circle',
          label: 'Help & Support',
          onPress: () => router.push('/support'),
          showArrow: true,
        },
        {
          icon: 'document-text',
          label: 'Terms & Privacy',
          onPress: () => router.push('/terms'),
          showArrow: true,
        },
        {
          icon: 'information-circle',
          label: 'About App',
          value: 'v1.0.0',
          onPress: () => router.push('/about'),
          showArrow: true,
        },
      ],
    },
  ];

  return (
    <View style={styles.container}>
      {/* Fixed Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.profileInfo}>
            <Image
              source="https://picsum.photos/200"
              style={styles.profileImage}
              contentFit="cover"
              transition={1000}
            />
            <View style={styles.profileText}>
              <Text style={styles.name}>{userProfile.name}</Text>
              <Text style={styles.email}>{userProfile.email}</Text>
              <Text style={styles.phone}>{userProfile.phone}</Text>
            </View>
          </View>
          <Pressable 
            style={styles.editButton}
            onPress={() => router.push('/edit-profile')}
          >
            <Ionicons name="create-outline" size={22} color={colors.primary} />
          </Pressable>
        </View>
      </View>

      {/* Scrollable Content */}
      <ScrollView 
        style={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          {accountStats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: stat.color + '15' }]}>
                <Ionicons name={stat.icon} size={24} color={stat.color} />
              </View>
              <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
              <Text style={styles.statTitle}>{stat.title}</Text>
            </View>
          ))}
        </View>

        {/* Menu Sections */}
        {menuSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.menuCard}>
              {section.items.map((item, itemIndex) => (
                <Pressable
                  key={itemIndex}
                  style={[
                    styles.menuItem,
                    itemIndex < section.items.length - 1 && styles.menuItemBorder
                  ]}
                  onPress={item.onPress}
                >
                  <View style={styles.menuItemLeft}>
                    <Ionicons name={item.icon} size={22} color="#666" />
                    <Text style={styles.menuItemLabel}>{item.label}</Text>
                  </View>
                  <View style={styles.menuItemRight}>
                    {item.value && !item.isToggle && (
                      <Text style={styles.menuItemValue}>{item.value}</Text>
                    )}
                    {item.isToggle ? (
                      <Switch
                        value={item.value}
                        onValueChange={item.onToggle}
                        trackColor={{ false: '#E5E5E5', true: `${colors.primary}50` }}
                        thumbColor={item.value ? colors.primary : '#fff'}
                      />
                    ) : item.showArrow ? (
                      <Ionicons name="chevron-forward" size={20} color="#666" />
                    ) : null}
                  </View>
                </Pressable>
              ))}
            </View>
          </View>
        ))}

        {/* Logout Button */}
        <Pressable 
          style={styles.logoutButton}
          onPress={() => {/* Handle logout */}}
        >
          <Ionicons name="log-out" size={20} color="#ff0000" />
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>

        {/* Version Info */}
        <Text style={styles.versionText}>Version 1.0.0</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9faf9',
  },
  header: {
    backgroundColor: 'white',
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 16,
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  profileText: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  phone: {
    fontSize: 14,
    color: '#666',
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${colors.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 16,
    marginBottom: 8,
  },
  menuCard: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuItemLabel: {
    fontSize: 16,
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  menuItemValue: {
    fontSize: 14,
    color: '#666',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ff0000',
  },
  logoutText: {
    color: '#ff0000',
    fontSize: 16,
    fontWeight: '500',
  },
  versionText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 12,
    marginBottom: 24,
  },
  scrollContent: {
    flex: 1,
  },
  scrollContainer: {
    paddingTop: 5,
  },
}); 