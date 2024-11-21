import { db } from './firebase'; // Firebase configuration
import { getDocs, collection, query, where } from "firebase/firestore";
import bcrypt from 'bcryptjs'; // Import bcrypt for password comparison

const unifiedLogin = async (username, password, navigate) => {
    try {
        // Check in the admins collection
        const adminsCollection = collection(db, "admins");
        const adminQuery = query(adminsCollection, where("username", "==", username));
        const adminSnapshot = await getDocs(adminQuery);

        if (!adminSnapshot.empty) {
            const adminDoc = adminSnapshot.docs[0];
            const storedPassword = adminDoc.data().password; // Stored hashed password

            // Compare the entered password with the stored hashed password
            const isPasswordValid = await bcrypt.compare(password, storedPassword);

            if (!isPasswordValid) throw new Error("Incorrect password.");

            // Redirect Admin to Dashboard
            localStorage.setItem('adminId', adminDoc.id);
            navigate("/DashboardPage");
            return;
        }

        // Check in the staffs collection
        const staffsCollection = collection(db, "staffs");
        const staffQuery = query(staffsCollection, where("username", "==", username));
        const staffSnapshot = await getDocs(staffQuery);

        if (!staffSnapshot.empty) {
            const staffDoc = staffSnapshot.docs[0];
            const { password: storedPassword, active } = staffDoc.data(); // Stored hashed password

            // Compare the entered password with the stored hashed password
            const isPasswordValid = await bcrypt.compare(password, storedPassword);

            if (!isPasswordValid) throw new Error("Incorrect password.");
            if (!active) throw new Error("Your account is inactive. Please contact Admin.");

            // Redirect Staff to Dashboard
            localStorage.setItem('staffId', staffDoc.id);
            navigate("/SDashboard");
            return;
        }

        throw new Error("Username not found.");
    } catch (error) {
        console.error("Login Error:", error.message);
        throw error;
    }
};

export default unifiedLogin;
