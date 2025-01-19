import { Stack } from 'expo-router';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { colors } from '../../util/constant';

export default function TabLayout() {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }} edges={['top']}>
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
                        tabBarIcon: ({ color, focused }) => (
                            <Ionicons name={focused ? "home" : "home-outline"} size={24} color={color} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="groups"
                    options={{
                        title: 'Groups',
                        tabBarIcon: ({ color, focused }) => (
                            <Ionicons name={focused ? "people" : "people-outline"} size={24} color={color} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="friends"
                    options={{
                        title: 'Friends',
                        tabBarIcon: ({ color, focused }) => (
                            <Ionicons name={focused ? "person-add" : "person-add-outline"} size={24} color={color} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="activity"
                    options={{
                        title: 'Activity',
                        tabBarIcon: ({ color, focused }) => (
                            <Ionicons name={focused ? "book" : "book-outline"} size={24} color={color} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="account"
                    options={{
                        title: 'Account',
                        tabBarIcon: ({ color, focused }) => (
                            <Ionicons name={focused ? "person-circle" : "person-circle-outline"} size={24} color={color} />
                        ),
                    }}
                />
            </Tabs>
            </SafeAreaView>
    );
}
