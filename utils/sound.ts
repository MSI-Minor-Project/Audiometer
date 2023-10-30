import { Audio } from "expo-av";
import { Alert } from "react-native";

const playSound = async (Sound:Audio.Sound) => {
    Alert.alert("Sound loading ...");

    const { sound } = await Audio.Sound.createAsync(require("./assets/audio/Elevator-music.mp3"), {
      shouldPlay: true,
      isLooping: true,
      audioPan: -1.0,
      androidImplementation: 'MediaPlayer',
    });
    // setSound(sound);

    return sound;

    Alert.alert("Sound playing ...");
  }

  const increasePitch = (sound:Audio.Sound) => {
    if (sound) {
      Alert.alert("Pitch increasing ...");
      sound.setRateAsync(1.5, true, Audio.PitchCorrectionQuality.High);
    } else {
      Alert.alert("Sound not playing ...");
    }
  }

  const stopSound = (sound:Audio.Sound) => {
    if (sound) {
      Alert.alert("Sound stopping ...");
      sound?.stopAsync();
    } else {
      Alert.alert("Sound not playing ...");
    }
  }

  const panLeftEar = async (sound:Audio.Sound) => {
    if (sound) {
      Alert.alert("Sound panning left ...");
      // await sound.stopAsync();
      sound.setVolumeAsync(1, -1.0);
      // await sound.playAsync();
    } else {
      Alert.alert("Sound not playing ...");
    }
  }