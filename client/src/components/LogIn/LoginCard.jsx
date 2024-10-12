// src/components/LoginCard.js

import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { Button, Form } from 'react-bootstrap';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginUser from '../../services/LoginUser';

export const LoginCard = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Attempt login through the LoginUser service
            await LoginUser(username, password);
            navigate("/DashboardPage"); // Navigate to dashboard after successful login
        } catch (error) {
            console.error("Login error:", error);
        } finally {
            setLoading(false); // Stop loading
        }
    };

    return (
        <Form onSubmit={handleLogin}>
            <FloatingLabel controlId="floatingInput" label="Username" className="mb-4">
                <Form.Control
                    type="text"
                    placeholder='Username'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
            </FloatingLabel>

            <FloatingLabel controlId="floatingPassword" label="Password">
                <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </FloatingLabel>

            <Button
                variant="primary"
                style={{ width: "70%", marginTop: "20px" }}
                type="submit"
                size='lg'
                disabled={loading}
            >
                {loading ? "Loading..." : "Login"}
            </Button>
        </Form>
    );
};
