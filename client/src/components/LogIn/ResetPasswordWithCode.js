import { useState } from "react";
import { getAuth, updatePassword } from "firebase/auth";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { app } from "./firebase"; // Import your Firebase configuration

const ResetPasswordWithCode = () => {
    const [username, setUsername] = useState("");
    const [verificationCode, setVerificationCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleResetPassword = async () => {
        try {
            const db = getFirestore(app);
            const adminDocRef = doc(db, "admins", username);
            const adminDoc = await getDoc(adminDocRef);

            if (!adminDoc.exists()) {
                setMessage("Invalid code or code expired.");
                return;
            }

            const data = adminDoc.data();
            if (data.resetCode !== verificationCode || Date.now() > data.expiresAt) {
                setMessage("Invalid or expired code.");
                return;
            }

            const auth = getAuth(app);
            const user = auth.currentUser;

            if (user) {
                await updatePassword(user, newPassword);

                // Optionally, remove the resetCode from the admin document
                await updateDoc(adminDocRef, {
                    resetCode: "",
                    expiresAt: null
                });

                setMessage("Password has been reset successfully.");
            } else {
                setMessage("Please log in to update your password.");
            }
        } catch (error) {
            setMessage(`Error: ${error.message}`);
        }
    };

    return (
        <div>
            <h2>Reset Password with Code</h2>
            <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="text"
                placeholder="Enter verification code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
            />
            <input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
            />
            <button onClick={handleResetPassword}>Reset Password</button>
            {message && <p>{message}</p>}
        </div>
    );
};

export default ResetPasswordWithCode;
