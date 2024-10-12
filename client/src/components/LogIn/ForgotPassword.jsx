import { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const auth = getAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            await sendPasswordResetEmail(auth, email);
            setMessage("Password reset email sent!");
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
