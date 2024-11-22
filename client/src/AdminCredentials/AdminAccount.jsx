import { db } from '../services/firebase'; // Firebase configuration
import { collection, addDoc } from "firebase/firestore";
import crypto from 'crypto';
import nodemailer from 'nodemailer';

// Generate a random verification code
function generateVerificationCode() {
    return crypto.randomBytes(16).toString('hex'); // Generate a random 16-byte string
}

// Send the verification email using Nodemailer
function sendVerificationEmail(adminEmail, verificationCode) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'your-email@gmail.com',
            pass: 'your-email-password', // Use App Password for Gmail
        },
    });

    const mailOptions = {
        from: 'your-email@gmail.com',
        to: adminEmail,
        subject: 'Admin Account Email Verification',
        text: `Please verify your email by clicking on the following link: 
           http://your-app.com/verify-email?token=${verificationCode}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email: ', error);
        } else {
            console.log('Email sent: ', info.response);
        }
    });
}

// Create the admin account and send the verification email
async function createAdminAccount(adminEmail) {
    const verificationCode = generateVerificationCode();
    const adminAccount = {
        username: 'admin123', // Default username
        password: 'hashedPassword', // Ensure password is hashed
        email_verified: false, // Email is not verified initially
        verification_code: verificationCode, // Store the verification code
    };

    // Save the admin account to Firestore
    try {
        const docRef = await addDoc(collection(db, "admins"), adminAccount);
        console.log('Admin account created with ID: ', docRef.id);

        // Send the verification email
        sendVerificationEmail(adminEmail, verificationCode);
    } catch (error) {
        console.error("Error creating admin account: ", error);
    }
}

// Call the function to create an admin account and send the verification email
createAdminAccount('admin-email@example.com');
