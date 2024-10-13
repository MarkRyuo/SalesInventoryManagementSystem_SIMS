import { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { getFirestore, query, where, getDocs, collection } from 'firebase/firestore';

const ForgotPassword = () => {
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const db = getFirestore();

    const handleVerifyUsername = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const q = query(collection(db, "admins"), where("username", "==", username));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                // Assuming you want to send the email of the first matching document
                const adminData = querySnapshot.docs[0].data();
                sendVerificationCode(adminData.email); // Send code to admin's email
                setMessage("Verification code sent to registered email.");
            } else {
                setMessage("Username not found.");
            }
        } catch (error) {
            setMessage("Error verifying username: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const sendVerificationCode = (email) => {
        // Generate a random verification code
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
        console.log(`Verification code sent to ${email}: ${verificationCode}`);

        // Optionally, store the verification code temporarily
        localStorage.setItem('verificationCode', verificationCode);

        // Here, you would integrate with your email sending service
        // Example: sendEmail(email, verificationCode);
        // For example, using a service like SendGrid or Firebase Cloud Functions
    };

    return (
        <Form onSubmit={handleVerifyUsername}>
            <Form.Group controlId="formBasicUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
            </Form.Group>
            <Button variant="primary" type="submit" disabled={loading}>
                {loading ? "Verifying..." : "Send Verification Code"}
            </Button>
            {message && <p>{message}</p>}
        </Form>
    );
};

export default ForgotPassword;
