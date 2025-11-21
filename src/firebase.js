import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCtMFODfKTXG4gycQuyfqcZlfWjTDZD5zg",
  authDomain: "app-skola.firebaseapp.com",
  projectId: "app-skola",
  storageBucket: "app-skola.firebasestorage.app",
  messagingSenderId: "415025115504",
  appId: "1:415025115504:web:ac6bfe8ce08b2dc81a1fb5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firestore
export const db = getFirestore(app);
