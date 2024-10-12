// ForgotPassword.js
import { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid'; // Import UUID for generating unique tokens

const db = getFirestore();

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const auth = getAuth();
    const navigate = useNavigate();

    const storeToken = async (email) => {
        const token = uuidv4(); // Generate a unique token

        try {
            // Store the token in Firestore
            await setDoc(doc(db, "passwordResetTokens", email), { token });
            return token; // Return the generated token
        } catch (error) {
            console.error("Error storing token:", error);
            throw error; // Throw error to be handled later
        }
    };

    const sendEmail = async (email, resetLink) => {
        // Replace this function with actual email sending logic
        console.log(`Sending email to ${email} with reset link: ${resetLink}`);
        // Implement your email sending logic here
    };

    const sendResetEmail = async () => {
        const token = await storeToken(email); // Store the token and get the generated token
        const resetLink = `${window.location.origin}/reset-password?token=${token}&email=${email}`; // Create reset link

        try {
            await sendEmail(email, resetLink);
            setMessage("Password reset email sent! Please check your inbox.");
            setTimeout(() => {
                navigate("/"); // Adjust the path as necessary
            }, 2000);
        } catch (error) {
            setMessage("Error sending password reset email: " + error.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            await sendResetEmail(); // Send reset email with the link
        } catch (error) {
            setMessage("Error generating reset email: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </Form.Group>
            <Button variant="primary" type="submit" disabled={loading}>
                {loading ? "Sending..." : "Send Password Reset Email"}
            </Button>
            {message && <p>{message}</p>}
        </Form>
    );
};

export default ForgotPassword;
