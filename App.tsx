import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { Audio } from "expo-av";
import { Alert, Button } from 'react-native';
import { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { PaperProvider } from 'react-native-paper';
import { Dimensions } from "react-native";
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';

const screenWidth = Dimensions.get("window").width;

const Tab = createBottomTabNavigator();

const data = {
  labels: ["January", "February", "March", "April", "May", "June"],
  datasets: [
    {
      data: [20, 45, 28, 80, 99, 43],
      color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
      strokeWidth: 2 // optional
    }
  ],
  legend: ["Rainy Days"] // optional
};

const chartConfig = {
  backgroundGradientFrom: "#1E2923",
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: "#08130D",
  backgroundGradientToOpacity: 0,
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  strokeWidth: 2, // optional, default 3
  barPercentage: 0.5,
  useShadowColorFromDataset: false // optional
};

export default function App() {

  const [sound, setSound] = useState<Audio.Sound | null>(null);

  const playSound = async () => {
    Alert.alert("Sound loading ...");

    const { sound } = await Audio.Sound.createAsync(require("./assets/audio/Elevator-music.mp3"), {
      shouldPlay: true,
      isLooping: true,
      audioPan: -1.0,
      androidImplementation: 'MediaPlayer'
    });
    setSound(sound);

    Alert.alert("Sound playing ...");
  }

  const increasePitch = () => {
    if (sound) {
      Alert.alert("Pitch increasing ...");
      sound.setRateAsync(1.5, true, Audio.PitchCorrectionQuality.High);
    } else {
      Alert.alert("Sound not playing ...");
    }
  }

  const stopSound = () => {
    if (sound) {
      Alert.alert("Sound stopping ...");
      sound?.stopAsync();
    } else {
      Alert.alert("Sound not playing ...");
    }
  }

  const panLeftEar = async () => {
    if (sound) {
      Alert.alert("Sound panning left ...");
      // await sound.stopAsync();
      sound.setVolumeAsync(1, -1.0);
      // await sound.playAsync();
    } else {
      Alert.alert("Sound not playing ...");
    }
  }

  useEffect(() => {
    return sound ? () => {
      Alert.alert("Sound unloading ...");
      sound.unloadAsync();
    }
      : undefined;
  }, [sound]);

  return (
    <PaperProvider>
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Login" component={LoginScreen} options={{
            headerShown: false
          }} />
        </Tab.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
