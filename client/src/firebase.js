// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCWFpzSub_ZftjIlwuIVNdZaVeEVNn5B7M",
    authDomain: "salesinventorymanagementsystem.firebaseapp.com",
    projectId: "salesinventorymanagementsystem",
    storageBucket: "salesinventorymanagementsystem.appspot.com",
    messagingSenderId: "1010354680755",
    appId: "1:1010354680755:web:6ad17d17f2bfb517e6d1c6",
    measurementId: "G-1PQR95MF5L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
