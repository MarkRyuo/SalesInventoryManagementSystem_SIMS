// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Import Firebase Storage

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDY0DtB0ask49wI6t9DE6ltXmw62jbAgq4",
    authDomain: "salesinventorymanagement-1bb27.firebaseapp.com",
    projectId: "salesinventorymanagement-1bb27",
    storageBucket: "salesinventorymanagement-1bb27.appspot.com",
    messagingSenderId: "326509861898",
    appId: "1:326509861898:web:e9edc4069291f8bfa3d3f3",
    measurementId: "G-F893S7C35P"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app); // Initialize Firebase Storage
export const googleProvider = new GoogleAuthProvider();