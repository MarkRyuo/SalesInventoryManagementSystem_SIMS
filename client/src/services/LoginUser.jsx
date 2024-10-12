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
            alert("Login failed. Admin username not found.");
            console.log("Username not found.");
            return;
        }

        // Get the first matching admin document
        const adminDoc = querySnapshot.docs[0];
        const storedPassword = adminDoc.data().password;
        console.log("Admin document found:", adminDoc.id, "with stored password:", storedPassword);

        // Check if the password matches
        if (storedPassword !== password) {
            alert("Login failed. Incorrect password.");
            console.log("Incorrect password.");
            return;
        }

        // Successful login
        const adminId = adminDoc.id; // Use Firestore document ID as user ID
        localStorage.setItem('adminId', adminId); // Store the admin's UID
        console.log("Admin logged in successfully:", adminId);

    } catch (error) {
        console.error("Login error:", error.message);
        alert("Login failed. Please try again.");
    }
};

export default LoginUser;
