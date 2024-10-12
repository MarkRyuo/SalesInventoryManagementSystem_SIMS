// ResetPassword.js
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';

const db = getFirestore();

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const email = params.get('email');

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            // Verify the token from Firestore
            const tokenDoc = await getDoc(doc(db, "passwordResetTokens", email));
            if (tokenDoc.exists() && tokenDoc.data().token === token) {
                // Update password in Firestore (you should handle password hashing)
                await setDoc(doc(db, "admins", email), { password: newPassword });
                setMessage("Password has been reset successfully!");
            } else {
                setMessage("Invalid or expired token.");
            }
        } catch (error) {
            console.error("Error resetting password:", error);
            setMessage("Error resetting password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleResetPassword}>
            <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
            />
            <button type="submit" disabled={loading}>
                {loading ? "Resetting..." : "Reset Password"}
            </button>
            {message && <p>{message}</p>}
        </form>
    );
};

export default ResetPassword;
