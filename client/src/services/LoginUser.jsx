import { db } from '../firebase';
import { getDocs, collection, query, where } from "firebase/firestore";

const LoginUser = async (username, password) => {
    try {
        console.log("Login attempt:", username);

        // Access the admins collection
        const adminsCollection = collection(db, "admins");
        console.log("Admins collection reference obtained.");

        // Create a query to find the admin by username
        const q = query(adminsCollection, where("username", "==", username));
        console.log("Query created:", q);

        const querySnapshot = await getDocs(q);
        console.log("Query snapshot obtained:", querySnapshot);

        // Check if the admin exists
        if (querySnapshot.empty) {
            console.log("Username not found.");
            throw new Error("Admin username not found."); // Throw an error for non-existent username
        }

        // Get the first matching admin document
        const adminDoc = querySnapshot.docs[0];
        const storedPassword = adminDoc.data().password;
        console.log("Admin document found:", adminDoc.id, "with stored password:", storedPassword);

        // Check if the password matches
        if (storedPassword !== password) {
            console.log("Incorrect password.");
            throw new Error("Incorrect password."); // Throw an error for incorrect password
        }

        // Successful login
        const adminId = adminDoc.id; // Use Firestore document ID as user ID
        localStorage.setItem('adminId', adminId); // Store the admin's UID
        console.log("Admin logged in successfully:", adminId);

    } catch (error) {
        console.error("Login error:", error.message);
        throw error; // Rethrow the error to be caught in handleLogin
    }
};

export default LoginUser;
