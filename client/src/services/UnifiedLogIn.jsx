import { db } from './firebase'; // Firebase configuration
import { auth } from './firebase'; // Firebase Auth configuration
import { sendPasswordResetEmail } from "firebase/auth"; // Import reset functionality
import { getDocs, collection, query, where, updateDoc, doc } from "firebase/firestore";
import bcrypt from 'bcryptjs'; // Import bcrypt for password comparison

const MAX_ATTEMPTS = 5; // Maximum number of login attempts

const unifiedLogin = async (username, password, navigate) => {
    try {
        // Check in the admins collection by username first
        let adminQuery = query(collection(db, "admins"), where("username", "==", username));
        let adminSnapshot = await getDocs(adminQuery);

        if (adminSnapshot.empty) {
            // If no result by username, check by email
            adminQuery = query(collection(db, "admins"), where("email", "==", username));
            adminSnapshot = await getDocs(adminQuery);
        }

        if (!adminSnapshot.empty) {
            const adminDoc = adminSnapshot.docs[0];
            const { password: storedPassword, email, loginAttempts } = adminDoc.data();

            if (!email) {
                throw new Error("No Gmail connected. Contact support to link Gmail.");
            }

            if (loginAttempts >= MAX_ATTEMPTS) {
                // Trigger password reset email if too many failed attempts
                await sendPasswordResetEmail(auth, email);
                throw new Error("Too many failed attempts. Reset link sent to your Gmail.");
            }

            // For now, skip bcrypt validation for the admin
            if (password !== storedPassword) {
                // Increment login attempts for admin
                await updateDoc(doc(db, "admins", adminDoc.id), {
                    loginAttempts: loginAttempts + 1,
                });
                throw new Error("Incorrect password. Please try again.");
            }

            // Reset login attempts after successful login
            await updateDoc(doc(db, "admins", adminDoc.id), { loginAttempts: 0 });

            // Redirect Admin to Dashboard
            localStorage.setItem('adminId', adminDoc.id);
            navigate("/DashboardPage");
            return;
        }

        // Check in the staffs collection (unchanged)
        const staffsCollection = collection(db, "staffs");
        const staffQuery = query(staffsCollection, where("username", "==", username));
        const staffSnapshot = await getDocs(staffQuery);

        if (!staffSnapshot.empty) {
            const staffDoc = staffSnapshot.docs[0];
            const { password: storedPassword, active, loginAttempts } = staffDoc.data();

            if (loginAttempts >= MAX_ATTEMPTS) {
                throw new Error("Too many failed attempts. Contact the admin.");
            }

            // Use bcrypt for staff password comparison
            const isPasswordValid = await bcrypt.compare(password, storedPassword);

            if (!isPasswordValid) {
                await updateDoc(doc(db, "staffs", staffDoc.id), {
                    loginAttempts: loginAttempts + 1,
                });
                throw new Error("Incorrect password. Please try again.");
            }

            await updateDoc(doc(db, "staffs", staffDoc.id), { loginAttempts: 0 });

            if (!active) {
                throw new Error("Your account is inactive. Please contact Admin.");
            }

            localStorage.setItem('staffId', staffDoc.id);
            navigate("/SDashboard");
            return;
        }

        throw new Error("Username or email not found.");
    } catch (error) {
        console.error("Login Error:", error.message);
        throw error;
    }
};

export default unifiedLogin;
