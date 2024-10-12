// LoginCard.jsx

import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { Button, Form } from 'react-bootstrap';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"; // Importing signInWithEmailAndPassword

export const LoginCard = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState(""); // Changed to email
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        const auth = getAuth();
        try {
            // Sign in the user
            await signInWithEmailAndPassword(auth, email, password);
            console.log("User logged in successfully");
            navigate("/DashboardPage"); // Navigate to the dashboard after successful login
        } catch (error) {
            console.error("Login error:", error.message);
            alert("Login failed. Please try again.");
        }
    };

    return (
        <Form>
            {/* Email Field */}
            <FloatingLabel controlId="floatingInput" label="Email" className="mb-4">
                <Form.Control
                    type="email"
                    placeholder='Email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} // Updated to email input
                />
            </FloatingLabel>

            {/* Password Field */}
            <FloatingLabel controlId="floatingPassword" label="Password">
                <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </FloatingLabel>

            {/* Login Button */}
            <Button
                variant="primary"
                style={{ width: "70%", marginTop: "20px" }}
                onClick={handleLogin}
                size='lg'>
                Login
            </Button>
        </Form>
    );
};
