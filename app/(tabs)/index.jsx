import { Image } from 'expo-image';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PieChart } from "react-native-gifted-charts";
import { colors } from '../../util/constant';

export default function Chat() {
  const lentData = [
    { value: 70, color: 'green' },
    { value: 30, color: 'lightgray' }
  ];

  const borrowData = [
    { value: 50, color: 'brown' },
    { value: 50, color: 'lightgray' }
  ];
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          style={styles.image}
          source="https://picsum.photos/200"
          contentFit="cover"
          transition={1000}
        />
        <View>
          <Text>Hi, Deepak</Text>
        </View>
        <View style={styles.notification}>
          <Ionicons name="notifications" size={24} color="black" />
          {true && ( // Replace 'true' with your condition
            <View style={styles.badge} />
          )}
        </View>
      </View>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardText}>Total Spend(L+B)</Text>
          <Text style={styles.textcolor}>$100</Text>
        </View>
        <View style={styles.cardHeader}>
          <Text style={styles.cardText}>Active Group</Text>
          <Text style={styles.textcolor}>2</Text>
        </View>
        <View style={styles.chart}>
          <View style={styles.chartContainer}>
            <PieChart
              donut
              innerRadius={50}
              radius={70}
              data={lentData}
              centerLabelComponent={() => {
                return <Text style={{ fontSize: 24 }}>70%</Text>;
              }}
            />
            <Text style={styles.textcolor}>Lent</Text>
          </View>
          <View>
            <PieChart
              donut
              innerRadius={50}
              radius={70}
              data={borrowData}
              centerLabelComponent={() => {
                return <Text style={{ fontSize: 24 }}>50%</Text>;
              }}
            />
            <Text style={styles.textcolor}>Borrowed</Text>
          </View>
        </View>


      </View>
      <Text style={styles.title}>Chat</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 10,
    paddingTop: 20,
  },
  notification: {
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: '#E5E5E5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chart: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  image: {
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: '#0553',
  },
  card: {
    height: 280, // Increased height to accommodate the chart
    width: '100%',
    backgroundColor: colors.primary,
    marginTop: 16,
    borderRadius: 10,
    padding: 10,
  },
  cardText: {
    color: '#9ea0a7',
    paddingStart: 10,
    paddingTop: 10,
  },
  badge: {
    position: 'absolute',
    right: 4,  // Changed from -5 to 8
    top: -4,    // Changed from -5 to 8
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'lightblue',
  },
  textcolor: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf: 'center',

  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
}); 