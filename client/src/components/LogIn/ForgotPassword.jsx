import { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const auth = getAuth();
    const navigate = useNavigate();

    const updateAdminPasswordInFirestore = async (newPassword) => {
        const db = getFirestore();
        const adminDocRef = doc(db, "admins", "adminId"); // Replace with the actual admin document ID

        try {
            await updateDoc(adminDocRef, {
                password: newPassword, // Update the password field
            });
            console.log("Admin password updated in Firestore!");
        } catch (error) {
            console.error("Error updating password in Firestore:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            await sendPasswordResetEmail(auth, email);
            setMessage("Password reset email sent!");
            // Prompt the user to enter the new password (you might want to do this differently)
            const newPassword = prompt("Enter your new password:"); // This is just for illustration
            if (newPassword) {
                await updateAdminPasswordInFirestore(newPassword); // Update Firestore with the new password
            }
            // Navigate back to login after a delay
            setTimeout(() => {
                navigate("/"); // Adjust the path as necessary
            }, 2000);
        } catch (error) {
            setMessage("Error sending password reset email: " + error.message);
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
