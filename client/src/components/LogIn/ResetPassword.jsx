// ResetPassword.js
import { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';

const db = getFirestore();

const ResetPassword = () => {
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [token, setToken] = useState(new URLSearchParams(window.location.search).get('token'));
    const [email, setEmail] = useState(new URLSearchParams(window.location.search).get('email'));

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const tokenDoc = await getDoc(doc(db, "passwordResetTokens", email));
            if (!tokenDoc.exists() || tokenDoc.data().token !== token) {
                throw new Error("Invalid or expired token.");
            }

            // Here, you would typically hash the password before storing it
            await updateDoc(doc(db, "admins", email), { password }); // Update the password in Firestore
            setMessage("Password has been reset successfully.");
            setTimeout(() => {
                navigate("/"); // Redirect after successful reset
            }, 2000);
        } catch (error) {
            setMessage("Error resetting password: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form onSubmit={handleResetPassword}>
            <Form.Group controlId="formBasicPassword">
                <Form.Label>New Password</Form.Label>
                <Form.Control
                    type="password"
                    placeholder="Enter your new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </Form.Group>
            <Button variant="primary" type="submit" disabled={loading}>
                {loading ? "Resetting..." : "Reset Password"}
            </Button>
            {message && <p>{message}</p>}
        </Form>
    );
};

export default ResetPassword;
