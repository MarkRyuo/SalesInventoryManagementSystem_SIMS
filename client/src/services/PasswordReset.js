// Import required libraries
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Initialize Firebase Admin
admin.initializeApp({
    credential: admin.credential.applicationDefault(), // O gamitin ang iyong service account key
    databaseURL: 'https://your-database-url.firebaseio.com' // Palitan ito ng iyong Firestore database URL
});

const db = admin.firestore();

// Function to generate a unique reset token
function generateResetToken() {
    return crypto.randomBytes(32).toString('hex'); // Creates a 32-byte token
}

// Function to store the reset token in Firestore
async function storeResetToken(email, token) {
    const expirationTime = Date.now() + 3600000; // 1 hour expiration

    await db.collection('admins').doc(email).set({
        resetToken: token,
        resetTokenExpires: expirationTime
    }, { merge: true }); // Use merge to avoid overwriting existing fields
}

// Function to send reset email with the custom link
async function sendResetEmail(email, token) {
    const transporter = nodemailer.createTransport({
        service: 'Gmail', // Use your email provider
        auth: {
            user: 'your-email@gmail.com', // Palitan ng iyong email
            pass: 'your-email-password' // Palitan ng iyong email password
        }
    });

    const resetLink = `https://your-app-url.com/reset-password?token=${token}&adminId=${email}`;

    const mailOptions = {
        from: 'your-email@gmail.com', // Palitan ng iyong email
        to: email,
        subject: 'Password Reset',
        text: `Click this link to reset your password: ${resetLink}`
    };

    await transporter.sendMail(mailOptions);
}

// Function to verify the reset token
async function verifyResetToken(email, token) {
    const doc = await db.collection('admins').doc(email).get();

    if (!doc.exists) {
        throw new Error('Admin not found');
    }

    const data = doc.data();

    if (data.resetToken !== token) {
        throw new Error('Invalid token');
    }

    if (Date.now() > data.resetTokenExpires) {
        throw new Error('Token expired');
    }

    // Allow user to reset their password
    return true;
}

// Function to reset the admin's password
async function resetPassword(email, newPassword) {
    const userRecord = await admin.auth().getUserByEmail(email); // Get user record by email

    await admin.auth().updateUser(userRecord.uid, {
        password: newPassword
    });

    // Delete the token fields from Firestore after reset
    await db.collection('admins').doc(email).set({
        resetToken: admin.firestore.FieldValue.delete(),
        resetTokenExpires: admin.firestore.FieldValue.delete()
    }, { merge: true });
}

// Example flow for password reset
async function initiatePasswordReset(email) {
    try {
        const token = generateResetToken();
        await storeResetToken(email, token);
        await sendResetEmail(email, token);
        console.log('Reset email sent successfully.');
    } catch (error) {
        console.error('Error initiating password reset:', error);
    }
}

// Usage example
// Uncomment the line below to test the password reset initiation
// initiatePasswordReset('admin@example.com');

// To verify the token and reset password
// (Call this in your reset password endpoint after user submits new password)
async function handlePasswordReset(email, token, newPassword) {
    try {
        await verifyResetToken(email, token);
        await resetPassword(email, newPassword);
        console.log('Password reset successfully.');
    } catch (error) {
        console.error('Error resetting password:', error);
    }
}

// Usage example for handling password reset
// Uncomment the line below to test the password reset handling
// handlePasswordReset('admin@example.com', 'received_token', 'new_password');
