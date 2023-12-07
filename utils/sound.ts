import { Audio } from "expo-av";
import { Alert } from "react-native";

export const playSound = async () => {
  Alert.alert("Sound loading ...");

  const { sound, status } = await Audio.Sound.createAsync(require("../assets/audio/Elevator-music.mp3"), {
    shouldPlay: true,
    isLooping: true,
    audioPan: -1.0,
    androidImplementation: 'MediaPlayer',
  });
  // setSound(sound);

  return sound;

  Alert.alert("Sound playing ...");
}

const increasePitch = (sound: Audio.Sound) => {
  if (sound) {
    Alert.alert("Pitch increasing ...");
    sound.setRateAsync(1.5, true, Audio.PitchCorrectionQuality.High);
  } else {
    Alert.alert("Sound not playing ...");
  }
}

const stopSound = (sound: Audio.Sound) => {
  if (sound) {
    Alert.alert("Sound stopping ...");
    sound?.stopAsync();
  } else {
    Alert.alert("Sound not playing ...");
  }
}

const panLeftEar = async (sound: Audio.Sound) => {
  if (sound) {
    Alert.alert("Sound panning left ...");
    // await sound.stopAsync();
    sound.setVolumeAsync(1, -1.0);
    // await sound.playAsync();
  } else {
    Alert.alert("Sound not playing ...");
  }
}

export const play100hz = async (earPosition: "left" | "right") => {
  Alert.alert("100hz Sound loading ...");

  const { sound, status } = await Audio.Sound.createAsync(require("../audio/100hz.mp3"), {
    shouldPlay: true,
    isLooping: true,
    audioPan: earPosition === "left" ? -1.0 : 1.0,
    androidImplementation: 'MediaPlayer',
  });
  // setSound(sound);

  Alert.alert("100 hz Sound playing ...");

  return sound;
}

export const play250hz = async (earPosition: "left" | "right") => {
  Alert.alert("250hz Sound loading ...");

  const { sound, status } = await Audio.Sound.createAsync(require("../audio/250hz.mp3"), {
    shouldPlay: true,
    isLooping: true,
    audioPan: earPosition === "left" ? -1.0 : 1.0,
    androidImplementation: 'MediaPlayer',
  });
  // setSound(sound);

  Alert.alert("250 hz Sound playing ...");

  return sound;
}

export const play500hz = async (earPosition: "left" | "right") => {
  Alert.alert("500hz Sound loading ...");

  const { sound, status } = await Audio.Sound.createAsync(require("../audio/500hz.mp3"), {
    shouldPlay: true,
    isLooping: true,
    audioPan: earPosition === "left" ? -1.0 : 1.0,
    androidImplementation: 'MediaPlayer',
  });
  // setSound(sound);

  Alert.alert("500 hz Sound playing ...");

  return sound;
}

export const play1000hz = async (earPosition: "left" | "right") => {
  Alert.alert("1000hz Sound loading ...");

  const { sound, status } = await Audio.Sound.createAsync(require("../audio/1000hz.mp3"), {
    shouldPlay: true,
    isLooping: true,
    audioPan: earPosition === "left" ? -1.0 : 1.0,
    volume: 0.1,
    androidImplementation: 'MediaPlayer',
  });
  // setSound(sound);

  Alert.alert("1000 hz Sound playing ...");

  return sound;
}

export const play2000hz = async (earPosition: "left" | "right") => {
  Alert.alert("2000hz Sound loading ...");

  const { sound, status } = await Audio.Sound.createAsync(require("../audio/2000hz.mp3"), {
    shouldPlay: true,
    isLooping: true,
    audioPan: earPosition === "left" ? -1.0 : 1.0,
    androidImplementation: 'MediaPlayer',
    volume: 0.1,
  });
  // setSound(sound);

  Alert.alert("2000 hz Sound playing ...");

  return sound;
}

export const play4000hz = async (earPosition: "left" | "right") => {
  Alert.alert("4000hz Sound loading ...");

  const { sound, status } = await Audio.Sound.createAsync(require("../audio/4000hz.mp3"), {
    shouldPlay: true,
    isLooping: true,
    audioPan: earPosition === "left" ? -1.0 : 1.0,
    androidImplementation: 'MediaPlayer',
  });
  // setSound(sound);

  Alert.alert("4000 hz Sound playing ...");

  return sound;
}

export const play8000hz = async (earPosition: "left" | "right") => {
  Alert.alert("8000hz Sound loading ...");

  const { sound, status } = await Audio.Sound.createAsync(require("../audio/8000hz.mp3"), {
    shouldPlay: true,
    isLooping: true,
    audioPan: earPosition === "left" ? -1.0 : 1.0,
    androidImplementation: 'MediaPlayer',
  });
  // setSound(sound);

  Alert.alert("8000 hz Sound playing ...");

  return sound;
}

export const increaseVolume = (sound: Audio.Sound, volumeAmount: number) => {
  if (sound) {
    Alert.alert("Volume increasing ...");
    sound.setVolumeAsync(volumeAmount);
  } else {
    Alert.alert("Sound not playing ...");
  }
}

export const stopPlayingSound = (sound: Audio.Sound) => {
  if (sound) {
    Alert.alert("Sound stopping ...");
    sound?.stopAsync();
  } else {
    Alert.alert("Sound not playing ...");
  }
}
