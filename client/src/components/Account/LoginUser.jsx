// src/services/LoginUser.js

import { db } from '../../firebase'; // Adjust the path to your Firebase configuration
import { getDocs, collection, query, where } from "firebase/firestore";

const LoginUser = async (username, password) => {
    try {
        // Access the users collection  
        const usersCollection = collection(db, "users");

        // Create a query to find the user by username
        const q = query(usersCollection, where("username", "==", username));
        const querySnapshot = await getDocs(q);

        // Check if the user exists
        if (querySnapshot.empty) {
            alert("Login failed. Username not found.");
            return;
        }

        // Get the first matching user document
        const userDoc = querySnapshot.docs[0];
        const storedPassword = userDoc.data().password;

        // Check if the password matches
        if (storedPassword !== password) {
            alert("Login failed. Incorrect password.");
            return;
        }

        // Successful login
        const userId = userDoc.id; // Use Firestore document ID as user ID
        localStorage.setItem('userId', userId); // Store the user's UID
        console.log("User logged in:", userId);

        // Redirect or perform additional actions as needed
        // For example: navigate("/DashboardPage");

    } catch (error) {
        console.error("Login error:", error.message);
        alert("Login failed. Please try again.");
    }
};

export default LoginUser;
