import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';

export default function Account() {

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Logged In View */}
        <View style={styles.profileContainer}>
          <Image
            source={{ uri: "https://picsum.photos/200" }}
            style={styles.profilePic}
          />
          <Text style={styles.name}>John Doe</Text>
          <Text style={styles.email}>john.doe@example.com</Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account Details</Text>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuText}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuText}>Change Password</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Feedback & Support</Text>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuText}>Rate the App</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuText}>Contact Support</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.logoutButton}>
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Made with ❤️ by Deepak</Text>
            <Text style={styles.footerSubText}>India</Text>
          </View>
        </View>
      
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9faf9",
  },
  profileContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 10,
    paddingBottom: 100,
  },
  profilePic: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
  },
  section: {
    width: '100%',
    marginTop: 24,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    borderColor: '#E5E5E5',
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
  menuItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuText: {
    fontSize: 16,
    color: '#666',
  },
  logoutButton: {
    marginTop: 32,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    backgroundColor: '#ff4444',
  },
  logoutText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  footer: {
    marginTop: 40,
    width: '100%',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  footerSubText: {
    fontSize: 12,
    color: '#999',
  }
}); 