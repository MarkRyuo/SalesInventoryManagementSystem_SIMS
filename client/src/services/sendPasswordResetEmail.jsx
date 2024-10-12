// src/SendPasswordResetEmail.js
import { useState } from 'react';
import { auth } from '../../firebase'; // Import auth from your firebase.js

const SendPasswordResetEmail = () => {
    const [adminEmail, setAdminEmail] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSendResetEmail = async (e) => {
        e.preventDefault();

        try {
            await auth.sendPasswordResetEmail(adminEmail); // Send reset email
            setSuccessMessage("Password reset email sent! Check your inbox.");
            setAdminEmail(''); // Clear the input
        } catch (error) {
            setErrorMessage("Error sending password reset email: " + error.message);
        }
    };

    return (
        <div>
            <h2>Send Password Reset Email</h2>
            <form onSubmit={handleSendResetEmail}>
                <input
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder="Enter admin email"
                    required
                />
                <button type="submit">Send Reset Email</button>
            </form>
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        </div>
    );
};

export default SendPasswordResetEmail;
