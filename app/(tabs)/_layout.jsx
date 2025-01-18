import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { colors } from '../../util/constant';

export default function TabLayout() {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }} >
            <StatusBar style="dark" backgroundColor="white" />
            
            <Tabs
                screenOptions={{
                    tabBarActiveTintColor: colors.primary,
                    tabBarStyle: {
                        height: 60,
                        paddingBottom: 5,
                        elevation: 0,
                        shadowOpacity: 0,
                        borderTopWidth: 0.5,
                        borderTopColor: '#E5E5E5'
                    },
                    headerShown: false,
                    headerShadowVisible: false,
                    tabBarShadowVisible: false,
                    sceneContainerStyle: {
                        backgroundColor: 'white'
                    }
                }}>
                <Tabs.Screen
                    name="index"
                    options={{
                        title: 'Home',
                        tabBarIcon: ({ color }) => (
                            <Ionicons name="home" size={24} color={color} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="groups"
                    options={{
                        title: 'Groups',
                        tabBarIcon: ({ color }) => (
                            <Ionicons name="people" size={24} color={color} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="friends"
                    options={{
                        title: 'Friends',
                        tabBarIcon: ({ color }) => (
                            <Ionicons name="person-add" size={24} color={color} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="activity"
                    options={{
                        title: 'Activity',
                        tabBarIcon: ({ color }) => (
                            <Ionicons name="book" size={24} color={color} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="account"
                    options={{
                        title: 'Account',
                        tabBarIcon: ({ color }) => (
                            <Ionicons name="person-circle" size={24} color={color} />
                        ),
                    }}
                />
            </Tabs>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: 'white',
    },
    
}); 