/// <reference types="nativewind/types" />
import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { Audio } from "expo-av";
import { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { PaperProvider } from 'react-native-paper';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import { createStackNavigator } from '@react-navigation/stack';
import StartScreen from './screens/StartScreen';
import { auth } from './firebase';
import Settings from './screens/Settings';

export type RootStack = {
  Start: undefined;
  Login: undefined;
  Register: undefined;
  App: undefined;
  Settings: undefined;
}

const Stack = createStackNavigator<RootStack>();
const Tab = createBottomTabNavigator();

const TabNavigatorComponent = () => {
  return <Tab.Navigator>
    <Tab.Screen name="Home" component={HomeScreen} />
  </Tab.Navigator>
}

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator>
          {auth.currentUser === null ? (
            <>
              <Stack.Screen name="Start" component={StartScreen} options={{
                headerShown: false
              }} />
              <Stack.Screen name="Register" component={RegisterScreen} options={{
                headerShown: true
              }} />
              <Stack.Screen name="Login" component={LoginScreen} options={{
                headerShown: true
              }} />
            </>
          ) : (
            <>
              <Stack.Screen name="App" component={TabNavigatorComponent} options={{
                headerShown: false
              }} />
              <Stack.Screen name="Settings" component={Settings} options={{
                headerShown: true
              }} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}