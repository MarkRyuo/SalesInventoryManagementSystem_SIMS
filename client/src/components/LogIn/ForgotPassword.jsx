// src/PasswordReset.js
import { useState } from "react";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import app from "./firebaseConfig";

const auth = getAuth(app);

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await sendPasswordResetEmail(auth, email);
            setMessage("Password reset email sent!");
            setEmail(""); // Clear the input field
        } catch (error) {
            setMessage("Error sending password reset email: " + error.message);
        }
    };

    return (
        <div>
            <h2>Reset Password</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type="submit">Send Reset Email</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default ForgotPassword;
