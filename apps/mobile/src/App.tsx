/**
 * Brain and Hand - Mobile App
 * 
 * Your personal AI bot, running on your phone.
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import { WelcomeScreen } from './screens/WelcomeScreen';
import { WizardScreen } from './screens/WizardScreen';
import { HomeScreen } from './screens/HomeScreen';

// Types
export type RootStackParamList = {
  Welcome: undefined;
  Wizard: undefined;
  Home: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  // TODO: Check if bot already configured
  const isConfigured = false;

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={isConfigured ? 'Home' : 'Welcome'}
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Wizard" component={WizardScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
