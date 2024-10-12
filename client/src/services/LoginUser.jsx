// src/services/LoginUser.js

import { db } from '../firebase';
import { getDocs, collection, query, where } from "firebase/firestore";

const LoginUser = async (username, password) => {
    try {
        // Access the admins collection
        const adminsCollection = collection(db, "admins");

        // Create a query to find the admin by username
        const q = query(adminsCollection, where("username", "==", username));
        const querySnapshot = await getDocs(q);

        // Check if the admin exists
        if (querySnapshot.empty) {
            alert("Login failed. Admin username not found.");
            return;
        }

        // Get the first matching admin document
        const adminDoc = querySnapshot.docs[0];
        const storedPassword = adminDoc.data().password;

        // Check if the password matches
        if (storedPassword !== password) {
            alert("Login failed. Incorrect password.");
            return;
        }

        // Successful login
        const userId = adminDoc.id; // Use Firestore document ID as user ID
        localStorage.setItem('userId', userId); // Store the admin's UID
        console.log("Admin logged in:", userId);

        // Redirect or perform additional actions as needed
        // For example: navigate("/DashboardPage");

    } catch (error) {
        console.error("Login error:", error.message);
        alert("Login failed. Please try again.");
    }
};

export default LoginUser;
