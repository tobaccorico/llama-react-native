
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Import existing Solana scaffold screens
import MainScreen from '../screens/MainScreen';
import OverviewScreen from '../screens/OverviewScreen';
import ChainsScreen from '../screens/ChainsScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Keep the existing home functionality in a stack
const WalletStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {backgroundColor: '#0A0A0A'},
      headerTintColor: '#FFF',
    }}>
    <Stack.Screen 
      name="WalletHome" 
      component={MainScreen} 
      options={{title: 'Wallet'}} 
    />
  </Stack.Navigator>
);

const OverviewStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {backgroundColor: '#0A0A0A'},
      headerTintColor: '#FFF',
    }}>
    <Stack.Screen 
      name="OverviewMain" 
      component={OverviewScreen} 
      options={{title: 'Overview'}} 
    />
  </Stack.Navigator>
);

const ChainsStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {backgroundColor: '#0A0A0A'},
      headerTintColor: '#FFF',
    }}>
    <Stack.Screen 
      name="ChainsMain" 
      component={ChainsScreen} 
      options={{title: 'Chains'}} 
    />
  </Stack.Navigator>
);

export const MainNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#1B1B1B',
          borderTopColor: '#2B2B2B',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#2172E5',
        tabBarInactiveTintColor: '#888',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerShown: false,
        unmountOnBlur: false, // Critical for state persistence
      }}>
      <Tab.Screen
        name="Overview"
        component={OverviewStack}
        options={{
          tabBarIcon: ({color, size}) => (
            <Icon name="dashboard" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Chains"
        component={ChainsStack}
        options={{
          tabBarIcon: ({color, size}) => (
            <Icon name="link" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Wallet"
        component={WalletStack}
        options={{
          tabBarIcon: ({color, size}) => (
            <Icon name="account-balance-wallet" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
