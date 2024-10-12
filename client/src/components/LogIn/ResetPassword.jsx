import  { useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleResetPassword = async (e) => {
        e.preventDefault();

        const urlParams = new URLSearchParams(window.location.search);
        const oobCode = urlParams.get('oobCode'); // Get the token from the URL

        if (!oobCode) {
            setErrorMessage("Invalid reset link.");
            return;
        }

        try {
            // Confirm the password reset with the token and new password
            await firebase.auth().confirmPasswordReset(oobCode, newPassword);

            // After resetting the password, update the Firestore database
            const user = firebase.auth().currentUser;
            if (user) {
                // Update the user document in Firestore
                const userRef = firebase.firestore().collection('admins').doc(user.uid); // Assuming 'admins' is your collection
                await userRef.update({
                    password: newPassword // Update the password field or any other relevant fields
                });
            }

            setSuccessMessage("Password has been reset successfully!");
            setNewPassword(''); // Clear the input
        } catch (error) {
            setErrorMessage("Error resetting password: " + error.message);
        }
    };

    return (
        <div>
            <h2>Reset Password</h2>
            <form onSubmit={handleResetPassword}>
                <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    required
                />
                <button type="submit">Reset Password</button>
            </form>
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        </div>
    );
};

export default ResetPassword;
