import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { Audio } from "expo-av";
import { Alert, Button } from 'react-native';
import { useEffect, useState } from 'react';

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
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
      <Button title='Play Sound' onPress={playSound} />
      <Button title='Stop Sound' onPress={stopSound} />
      <Button title='Increase Pitch' onPress={increasePitch} />
      <Button title='Pan Left Ear' onPress={panLeftEar} />
      <StatusBar style="auto" />
    </View>
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
