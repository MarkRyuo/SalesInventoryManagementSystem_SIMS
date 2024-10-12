import { Button, Form, FloatingLabel } from 'react-bootstrap';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase'; // Ensure you import your Firebase config
import { signInWithEmailAndPassword } from 'firebase/auth';

function SLoginCard() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault(); // Prevent default form submission

        try {
            // Sign in with Firebase Authentication
            await signInWithEmailAndPassword(auth, username, password);
            // Navigate to the dashboard on successful login
            navigate("/SDashboard");
        } catch (err) {
            console.error("Login error:", err);
            setError(err.message); // Set error message
        }
    };

    return (
        <>
            <Form onSubmit={handleLogin}>
                {/* Username */}
                <FloatingLabel controlId="floatingInput" label="Username" className="mb-4">
                    <Form.Control
                        type="text"
                        placeholder='Username'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)} // Update username state
                        required
                    />
                </FloatingLabel>

                {/* Password */}
                <FloatingLabel controlId="floatingPassword" label="Password">
                    <Form.Control
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} // Update password state
                        required
                    />
                </FloatingLabel>

                {/* Display Error Message */}
                {error && <div className="text-danger mb-3">{error}</div>}

                {/* Button of Login */}
                <Button
                    variant="primary"
                    style={{ width: "70%", marginTop: "20px" }}
                    type="submit" // Change to submit type to trigger form submission
                    size='lg'>
                    Login
                </Button>
            </Form>
        </>
    );
}

export default SLoginCard;
