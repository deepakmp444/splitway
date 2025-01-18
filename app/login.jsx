import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

export default function Login() {
  // This is just for demonstration, replace with actual auth state later
  const isLoggedIn = false;

  return (
    <View style={styles.container}>
      {!isLoggedIn ? (
        // Logged Out View
        <View style={styles.loginContainer}>
          <Image 
            source={{ uri: "https://picsum.photos/200" }}
            style={styles.placeholderImage}
          />
          <Text style={styles.welcomeText}>Welcome to App Name</Text>
          <TouchableOpacity style={styles.googleButton}>
            <Image 
              source={{ uri: "https://picsum.photos/200" }}
              style={styles.googleIcon}
            />
            <Text style={styles.buttonText}>Sign in with Google</Text>
          </TouchableOpacity>
        </View>
      ) : (
        // Logged In View
        <View style={styles.profileContainer}>
          <Image 
           source={{ uri: "https://picsum.photos/200" }}
            style={styles.profilePic}
          />
          <Text style={styles.name}>John Doe</Text>
          <Text style={styles.email}>john.doe@example.com</Text>
          
          <TouchableOpacity style={styles.logoutButton}>
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  loginContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  placeholderImage: {
    width: 120,
    height: 120,
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 32,
    textAlign: 'center',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  buttonText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  profileContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
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
  logoutButton: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  logoutText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
}); 