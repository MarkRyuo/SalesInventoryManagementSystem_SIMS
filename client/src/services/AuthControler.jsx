import { sendEmail } from './emailService';
import { generateToken, verifyToken } from './jwtService';
import { db } from './firebase'; // Your Firebase setup
import { doc, updateDoc } from 'firebase/firestore';

// Send verification email
export const sendVerificationEmail = async (req, res) => {
    const { email } = req.body;

    try {
        const token = generateToken({ email });
        const verificationLink = `${process.env.CLIENT_URL}/verify-email?token=${token}`;

        await sendEmail(
            email,
            "Verify Your Email",
            `<p>Click <a href="${verificationLink}">here</a> to verify your email.</p>`
        );

        res.status(200).json({ message: "Verification email sent." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Verify email
export const verifyEmail = async (req, res) => {
    const { token } = req.query;

    try {
        const { email } = verifyToken(token);
        const adminDoc = await db.collection('admins').where('email', '==', email).get();

        if (!adminDoc.empty) {
            const adminId = adminDoc.docs[0].id;
            await updateDoc(doc(db, 'admins', adminId), { isVerified: true });
            res.status(200).json({ message: "Email verified successfully." });
        } else {
            res.status(404).json({ message: "User not found." });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Send reset password email
export const sendResetPasswordEmail = async (req, res) => {
    const { email } = req.body;

    try {
        const token = generateToken({ email });
        const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${token}`;

        await sendEmail(
            email,
            "Reset Your Password",
            `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`
        );

        res.status(200).json({ message: "Password reset email sent." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Reset password
export const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        const { email } = verifyToken(token);
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const adminDoc = await db.collection('admins').where('email', '==', email).get();

        if (!adminDoc.empty) {
            const adminId = adminDoc.docs[0].id;
            await updateDoc(doc(db, 'admins', adminId), { password: hashedPassword });
            res.status(200).json({ message: "Password reset successfully." });
        } else {
            res.status(404).json({ message: "User not found." });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
