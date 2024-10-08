// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBuv3oJDJmx9LPa_ZammT7HksOLpsc23_o",
    authDomain: "salesinventoryms-74917.firebaseapp.com",
    databaseURL: "https://salesinventoryms-74917-default-rtdb.firebaseio.com",
    projectId: "salesinventoryms-74917",
    storageBucket: "salesinventoryms-74917.appspot.com",
    messagingSenderId: "792408841722",
    appId: "1:792408841722:web:0194606b5631a4dc785843",
    measurementId: "G-E7SSTVRZ03"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);