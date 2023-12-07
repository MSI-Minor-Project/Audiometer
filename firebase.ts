// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
// @ts-ignore
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCsgVM-LLGQMqi1AcORITtKbOZLcyFCpNE",
  authDomain: "audiometer-a5519.firebaseapp.com",
  projectId: "audiometer-a5519",
  storageBucket: "audiometer-a5519.appspot.com",
  messagingSenderId: "702086460865",
  appId: "1:702086460865:web:db501f3ac84b6fff24eb40",
  measurementId: "G-WNX22D4ZZE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  // @ts-nocheck
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export const db = initializeFirestore(app, {

})