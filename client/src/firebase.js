import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database"; // Import Firebase Realtime Database
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBtk690mSofPZ_i-UPb-oFTFYIwADdhNPw",
  authDomain: "capstone-project-d30c5.firebaseapp.com",
  projectId: "capstone-project-d30c5",
  storageBucket: "capstone-project-d30c5.appspot.com",
  messagingSenderId: "107809661150",
  appId: "1:107809661150:web:16dc91e28c1a0c9b6fe24f",
  measurementId: "G-XXXXXXXXXX" // Replace with your actual measurement ID if needed
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database
export const db = getDatabase(app); // Use getDatabase for Realtime Database

// Initialize Auth and Analytics
export const auth = getAuth(app);
export const analytics = getAnalytics(app);
