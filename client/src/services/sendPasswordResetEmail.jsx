import firebase from 'firebase/app';
import 'firebase/auth';

const sendPasswordResetEmail = async (adminEmail) => {
    try {
        await firebase.auth().sendPasswordResetEmail(adminEmail);
        console.log("Password reset email sent!");
    } catch (error) {
        console.error("Error sending password reset email: ", error.message);
        alert("Error: " + error.message); // Notify the user
    }
};

// Example usage
sendPasswordResetEmail('admin@example.com'); // Replace with the admin's email
