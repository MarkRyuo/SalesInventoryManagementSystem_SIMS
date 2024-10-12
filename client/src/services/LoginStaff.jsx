import { db } from '../firebase'; // Adjust the path to your Firebase configuration
import { getDocs, collection, query, where } from "firebase/firestore";
import { useNavigate } from 'react-router-dom'; // Import navigate

const LoginStaff = async (username, password) => {
    const navigate = useNavigate(); // Initialize navigate
    try {
        // Access the staff collection
        const staffCollection = collection(db, "staff");

        // Create a query to find the staff user by username
        const q = query(staffCollection, where("username", "==", username));
        const querySnapshot = await getDocs(q);

        console.log("Attempting to log in with staff username:", username);
        console.log("Staff Query Snapshot:", querySnapshot.docs); // Log the snapshot

        // Check if the staff user exists
        if (querySnapshot.empty) {
            alert("Login failed. Username not found.");
            return;
        }

        // Get the first matching staff user document
        const userDoc = querySnapshot.docs[0];
        console.log("Staff User Document Data:", userDoc.data()); // Log user data
        const storedPassword = userDoc.data().password;

        // Check if the password matches
        if (storedPassword.trim() !== password.trim()) {
            alert("Login failed. Incorrect password.");
            return;
        }

        // Successful login
        const userId = userDoc.id; // Use Firestore document ID as user ID
        localStorage.setItem('userId', userId); // Store the staff user's UID
        console.log("Staff user logged in:", userId);

        // Redirect after successful login
        navigate("/SDashboard"); // Navigate to staff dashboard

    } catch (error) {
        console.error("Staff Login error:", error.message);
        alert("Login failed. Please try again.");
    }
};

export default LoginStaff;
