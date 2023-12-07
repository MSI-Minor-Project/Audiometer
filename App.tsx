/// <reference types="nativewind/types" />
import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { Audio } from "expo-av";
import React, { Ref, RefObject, useEffect, useLayoutEffect, useRef, useState, useTransition } from 'react';
import { NavigationContainer, NavigationContainerRef, useNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Button, PaperProvider } from 'react-native-paper';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import { StackNavigationProp, createStackNavigator } from '@react-navigation/stack';
import StartScreen from './screens/StartScreen';
import { auth } from './firebase';
import Settings from './screens/Settings';
import { User, signOut } from 'firebase/auth';
import Test from './screens/Test';
import "expo-dev-client";
import Result from './screens/Result';
import Tests from './screens/Tests';
import { httpBatchLink } from '@trpc/client';
import { trpc } from './trpc/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AntDesign } from '@expo/vector-icons';
import Constants from "expo-constants";

export type RootStack = {
  Start: undefined;
  Login: undefined;
  Register: undefined;
  App: {
    screen: string;
  };
  Settings: undefined;
  Test: undefined;
  Result: {
    testId: string,
  };
  TestResult: {
    testId: string,
    userId: string
  }
}

const Stack = createStackNavigator<RootStack>();
const Tab = createBottomTabNavigator();

type StackProps = StackNavigationProp<RootStack, "App">;

const navigationRef = React.createRef<any>()

const getBaseUrl = () => {
  /**
   * Gets the IP address of your host-machine. If it cannot automatically find it,
   * you'll have to manually set it. NOTE: Port 3000 should work for most but confirm
   * you don't have anything else running on it, or you'd have to change it.
   *
   * **NOTE**: This is only for development. In production, you'll want to set the
   * baseUrl to your production API URL.
   */

  const debuggerHost = Constants.expoConfig?.hostUri;
  const localhost = debuggerHost?.split(":")[0];

  if (!localhost) {
    // return "https://turbo.t3.gg";
    throw new Error(
      "Failed to get localhost. Please point to your production server.",
    );
  }
  return `http://${localhost}:3000`;
};

/**
 * A wrapper for your app that provides the TRPC context.
 * Use only in _app.tsx
 */

const TabNavigatorComponent = () => {

  return <Tab.Navigator>
    <Tab.Screen name="Home" component={HomeScreen} options={{
      title: "Home",
      headerTitleAlign: "center",
      headerBackground: () => <View style={{ backgroundColor: "#746CC0", height: "100%" }} />,
      headerTintColor: "white",
      headerTitle: () => <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>Petralex hearing test</Text>,
      tabBarIcon: () => <AntDesign name="home" size={24} color="black" />
    }} />
    <Tab.Screen name="Tests" component={Tests} options={{
      title: "Tests",
      headerTitleAlign: "center",
      headerBackground: () => <View style={{ backgroundColor: "#746CC0", height: "100%" }} />,
      headerTintColor: "white",
      tabBarIcon: () => <AntDesign name="profile" size={24} color="black" />,
      headerRight: () => <Button style={{
        backgroundColor: "red"
      }} onPress={async () => {
        await signOut(auth).then(() => {
          if (navigationRef !== null)
            navigationRef.current.navigate("Start");
          else
            console.log("Navigation ref is null");
        });
      }}>
        Sign out
      </Button>
    }} />
  </Tab.Navigator>
}

export default function App() {

  const [user, setUser] = useState<User | null>(null);
  const [queryClient] = useState(() => new QueryClient());

  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: `${getBaseUrl()}`,
          headers() {
            const headers = new Map<string, string>();
            headers.set("x-trpc-source", "expo-react");
            return Object.fromEntries(headers);
          },
        }),
      ],
    }),
  );


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
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <NavigationContainer ref={navigationRef}>
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
                    headerShown: false,

                  }} />
                  <Stack.Screen name="Settings" component={Settings} options={{
                    headerShown: true
                  }} />
                  <Stack.Screen name="Test" component={Test} options={{
                    headerShown: true,
                    presentation: "modal",
                    title: "Hearing Test",
                  }} />
                  <Stack.Screen name="Result" component={Result} options={{
                    headerShown: true,
                    title: "Result",
                    presentation: "modal"
                  }} />
                  <Stack.Screen name="TestResult" component={Tests} options={{
                    headerShown: true,
                    title: "Test Result",
                    presentation: "modal"
                  }} />
                </>
              )}
            </Stack.Navigator>
            <StatusBar style="inverted" />
          </NavigationContainer>
        </QueryClientProvider>
      </trpc.Provider>
    </PaperProvider>
  );
}