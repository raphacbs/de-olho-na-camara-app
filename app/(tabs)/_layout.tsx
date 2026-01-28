import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';

type IconProps = ComponentProps<typeof Ionicons> & { color: string; size: number };

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#005A9C',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: { backgroundColor: '#FFFFFF', borderTopColor: '#E5E5EA' },
      }}
    >
      <Tabs.Screen name="home" options={{ title: 'Início', tabBarIcon: ({ color, size }: { color: string; size: number }) => (<Ionicons name="home-outline" color={color} size={size} />) }} />
      <Tabs.Screen name="deputados" options={{ title: 'Deputados', tabBarIcon: ({ color, size }: { color: string; size: number }) => (<Ionicons name="people-outline" color={color} size={size} />) }} />
      <Tabs.Screen name="proposals" options={{ title: 'Proposições', tabBarIcon: ({ color, size }: { color: string; size: number }) => (<Ionicons name="document-text-outline" color={color} size={size} />) }} />
      <Tabs.Screen name="votes" options={{ title: 'Votações', tabBarIcon: ({ color, size }: { color: string; size: number }) => (<Ionicons name="checkbox-outline" color={color} size={size} />) }} />
      <Tabs.Screen name="settings" options={{ title: 'Configurações', tabBarIcon: ({ color, size }: { color: string; size: number }) => (<Ionicons name="settings-outline" color={color} size={size} />) }} />
    </Tabs>
  );
}
