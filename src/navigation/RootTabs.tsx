
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { DeputadosScreen } from '@/screens/DeputadosScreen';
import { ProposalsScreen } from '@/screens/ProposalsScreen';
import { VotesScreen } from '@/screens/VotesScreen';
import { SettingsScreen } from '@/screens/SettingsScreen';
import { RootTabParamList } from '@/types/navigation';
import { NewHomeScreen } from '@/screens/NewHomeScreen';
import { SDUIHomeScreen } from '@/screens/SDUIHomeScreen';

const Tab = createBottomTabNavigator<RootTabParamList>();

/** Feature flag: set EXPO_PUBLIC_SDUI_ENABLED=true to use the SDUI home screen. */
const isSduiEnabled = process.env.EXPO_PUBLIC_SDUI_ENABLED === 'true';

const HomeScreen = isSduiEnabled ? SDUIHomeScreen : NewHomeScreen;

export function RootTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#005A9C',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E5E5EA',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Início',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Deputados"
        component={DeputadosScreen}
        options={{
          title: 'Deputados(as)',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Proposições"
        component={ProposalsScreen}
        options={{
          title: 'Proposições',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="document-text-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Votações"
        component={VotesScreen}
        options={{
          title: 'Votações',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="checkbox-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Configurações"
        component={SettingsScreen}
        options={{
          title: 'Configurações',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
