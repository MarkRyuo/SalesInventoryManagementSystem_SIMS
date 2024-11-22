import { db } from './firebase'; // Firebase configuration
import { getDocs, collection, query, where, updateDoc, doc } from "firebase/firestore";
import bcrypt from 'bcryptjs'; // Import bcrypt for password comparison

const MAX_ATTEMPTS = 5; // Maximum number of login attempts

const unifiedLogin = async (username, password, navigate) => {
    try {
        // Check in the admins collection
        const adminsCollection = collection(db, "admins");
        const adminQuery = query(adminsCollection, where("username", "==", username));
        const adminSnapshot = await getDocs(adminQuery);

        if (!adminSnapshot.empty) {
            const adminDoc = adminSnapshot.docs[0];
            const storedPassword = adminDoc.data().password; // Stored hashed password
            const emailVerified = adminDoc.data().email_verified; // Check if email is verified
            const attempts = adminDoc.data().loginAttempts || 0; // Track failed attempts

            if (attempts >= MAX_ATTEMPTS) {
                throw new Error("Too many failed attempts. Please reset your password.");
            }

            if (!emailVerified) {
                throw new Error("Your email is not verified. Please check your inbox for the verification link.");
            }

            // Compare the entered password with the stored hashed password
            const isPasswordValid = await bcrypt.compare(password, storedPassword);

            if (!isPasswordValid) {
                // Increment login attempts for admin
                await updateDoc(doc(db, "admins", adminDoc.id), {
                    loginAttempts: attempts + 1,
                });
                throw new Error("Incorrect password. Please try again.");
            }

            // Reset login attempts after successful login
            await updateDoc(doc(db, "admins", adminDoc.id), {
                loginAttempts: 0,
            });

            // Redirect Admin to Dashboard
            localStorage.setItem('adminId', adminDoc.id);
            navigate("/DashboardPage");
            return;
        }

        // Check in the staffs collection (same as before)
        const staffsCollection = collection(db, "staffs");
        const staffQuery = query(staffsCollection, where("username", "==", username));
        const staffSnapshot = await getDocs(staffQuery);

        if (!staffSnapshot.empty) {
            const staffDoc = staffSnapshot.docs[0];
            const { password: storedPassword, active, loginAttempts } = staffDoc.data(); // Stored hashed password

            if (loginAttempts >= MAX_ATTEMPTS) {
                throw new Error("Too many failed attempts. Contact the admin.");
            }

            // Compare the entered password with the stored hashed password
            const isPasswordValid = await bcrypt.compare(password, storedPassword);

            if (!isPasswordValid) {
                // Increment login attempts for staff
                await updateDoc(doc(db, "staffs", staffDoc.id), {
                    loginAttempts: loginAttempts + 1,
                });
                throw new Error("Incorrect password. Please try again.");
            }

            // Reset login attempts after successful login
            await updateDoc(doc(db, "staffs", staffDoc.id), {
                loginAttempts: 0,
            });

            if (!active) {
                throw new Error("Your account is inactive. Please contact Admin.");
            }

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
