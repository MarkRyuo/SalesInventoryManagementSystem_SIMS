// ResetPassword.js
import { useState } from "react";
import axios from "axios";

const ResetPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handlePasswordReset = async () => {
        try {
            // Generate a random verification code
            const code = Math.floor(100000 + Math.random() * 900000).toString();

            // Call your server endpoint to send the verification code
            const response = await axios.post('http://localhost:3000/send-code', {
                email: email,
                code: code
            });

            setMessage(response.data); // Success message from server
            setError("");
        } catch (err) {
            setError(err.response ? err.response.data : "Error sending code.");
            setMessage("");
        }
    };

    return (
        <div>
            <h2>Reset Password</h2>
            <input
                type="email"
                placeholder="Enter admin email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <button onClick={handlePasswordReset}>Send Reset Code</button>
            {message && <p style={{ color: "green" }}>{message}</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
};

export default ResetPassword;
