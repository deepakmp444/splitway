import { View, Text, StyleSheet } from 'react-native';

export default function Activity() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Activity</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "white",
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
}); 