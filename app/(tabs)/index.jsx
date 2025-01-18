import React, { useCallback, useRef } from 'react';
import { Image } from 'expo-image';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PieChart } from "react-native-gifted-charts";
import { useRouter } from 'expo-router';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { colors } from '../../util/constant';


export default function Home() {
  const router = useRouter();
  const bottomSheetRef = useRef(null);
  const snapPoints = ['45%', '100%'];
  const [currentSnapPoint, setCurrentSnapPoint] = React.useState(0);

  const handleSheetChanges = useCallback((index) => {
    setCurrentSnapPoint(index);
  }, []);

  const lentData = [
    { value: 70, color: '#38b000' },
    { value: 30, color: '#f0f0f0' }
  ];

  const borrowData = [
    { value: 50, color: '#ff0000' },
    { value: 50, color: '#f0f0f0' }
  ];

  return (
    <View style={styles.container}>

      <View style={styles.subcontainer}>
        <View style={styles.header}>
          <Pressable onPress={() => router.push('/account')}>
            <Image
              style={styles.image}
              source="https://picsum.photos/200"
              contentFit="cover"
              transition={1000}
            />
          </Pressable>
          <View>
            <Text>Hi, Deepak</Text>
          </View>
          <Pressable onPress={() => router.push('/activity')}>
            <View style={styles.notification}>
              <Ionicons name="notifications" size={24} color="black" />
              {true && ( // Replace 'true' with your condition
                <View style={styles.badge} />
              )}
            </View>
          </Pressable>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardText}>Total Spend(Lent+Borrowed)</Text>
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
              <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                <Text style={{ color: 'yellow' }}>Lent </Text>
                <Text style={{ color: 'white' }}>$200</Text>
              </View>
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
              <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                <Text style={{ color: 'yellow' }}>Borrowed </Text>
                <Text style={{ color: 'white' }}>$200</Text>
              </View>
            </View>
          </View>
        </View>

        <BottomSheet
          ref={bottomSheetRef}
          snapPoints={snapPoints}
          enablePanDownToClose={false}
          backgroundStyle={{ backgroundColor: "#f9faf9" }}
          onChange={handleSheetChanges}
          index={0}
        >
          <View style={styles.stickyHeader}>
            <Text style={{ fontWeight: 'bold' }}>Recent Transactions</Text>
          </View>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search transactions..."
              placeholderTextColor="#666"
              onFocus={() => {
                if (currentSnapPoint === 0) {
                  bottomSheetRef.current?.snapToIndex(1);
                }
                router.push('/search');
              }}
            />
          </View>
          <BottomSheetScrollView>
            <View style={{ padding: 10 }}>
              <View style={styles.transactionList}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
                  <View key={item} style={styles.transactionCard}>
                    <View style={styles.transactionLeft}>
                      <View style={styles.transactionIcon}>
                        <Ionicons
                          name={item % 2 === 0 ? "arrow-up" : "arrow-down"}
                          size={24}
                          color={item % 2 === 0 ? "#38b000" : "#ff0000"}
                        />
                      </View>
                      <View>
                        <Text style={styles.transactionTitle}>Transaction {item}</Text>
                        <Text style={styles.transactionDate}>March 24, 2024</Text>
                      </View>
                    </View>
                    <Text style={[
                      styles.transactionAmount,
                      { color: item % 2 === 0 ? "#38b000" : "#ff0000" }
                    ]}>
                      {item % 2 === 0 ? "+" : "-"}$120
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </BottomSheetScrollView>
        </BottomSheet>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollContainer: {
    flex: 1,
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
    height: 270, // Increased height to accommodate the chart
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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 16,
  },
  scrollView: {
    marginTop: 10,
  },
  scrollCard: {
    backgroundColor: 'white',
    padding: 16,
    marginRight: 12,
    borderRadius: 12,
    width: 200,
    borderColor: '#E5E5E5',
    borderWidth: 1,
  },
  scrollCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  scrollCardTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  scrollCardAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  scrollCardDescription: {
    fontSize: 14,
    color: '#666',
  },
  transactionList: {
    gap: 8,
  },
  transactionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 8,
    borderRadius: 12,
    borderColor: '#E5E5E5',
    borderWidth: 1,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  transactionIcon: {
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  transactionDate: {
    fontSize: 14,
    color: '#666',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  stickyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    height: 44,
    backgroundColor: 'white',
    borderRadius: 22,
    paddingHorizontal: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  searchButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
}); 