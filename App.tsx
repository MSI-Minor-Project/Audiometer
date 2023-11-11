/// <reference types="nativewind/types" />
import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { Audio } from "expo-av";
import { useEffect, useLayoutEffect, useState, useTransition } from 'react';
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
import { User } from 'firebase/auth';
import Test from './screens/Test';
import "expo-dev-client";
import Result from './screens/Result';

export type RootStack = {
  Start: undefined;
  Login: undefined;
  Register: undefined;
  App: {
    screen: string;
  };
  Settings: undefined;
  Test: undefined;
  Result: undefined;
}

const Stack = createStackNavigator<RootStack>();
const Tab = createBottomTabNavigator();

const TabNavigatorComponent = () => {
  return <Tab.Navigator>
    <Tab.Screen name="Home" component={HomeScreen} options={{
      title: "Home",
      headerTitleAlign: "center",
      headerBackground: () => <View style={{ backgroundColor: "#746CC0", height: "100%" }} />,
      headerTintColor: "white",
      headerTitle: () => <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>Petralex hearing test</Text>
    }} />
  </Tab.Navigator>
}

export default function App() {

  const [user, setUser] = useState<User | null>(null);

  useLayoutEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    })
  }, [auth.currentUser]);

  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator>
          {user === null ? (
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
              <Stack.Screen name="Test" component={Test} options={{
                headerShown: true,
                presentation: "modal",
                title: "Hearing Test"
              }} />
              <Stack.Screen name="Result" component={Result} options={{
                headerShown: true,
                title: "Result",
                presentation: "modal"
              }} />
            </>
          )}
        </Stack.Navigator>
        <StatusBar style="inverted" />
      </NavigationContainer>
    </PaperProvider>
  );
}