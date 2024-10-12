import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { Button, Form } from 'react-bootstrap';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from './firebase'; // Import Firebase configuration
import { signInWithEmailAndPassword } from "firebase/auth";

export const LoginCard = () => {
    const navigate = useNavigate();
    const [emailOrUsername, setEmailOrUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        try {
            await signInWithEmailAndPassword(auth, emailOrUsername, password);
            navigate("/DashboardPage");
        } catch (error) {
            console.error("Login error:", error.message);
            alert("Login failed. Please check your credentials.");
        }
    };

    return (
        <Form>
            <FloatingLabel controlId="floatingInput" label="Email or Username" className="mb-4">
                <Form.Control
                    type="text"
                    placeholder='Email or Username'
                    value={emailOrUsername}
                    onChange={(e) => setEmailOrUsername(e.target.value)}
                />
            </FloatingLabel>

            <FloatingLabel controlId="floatingPassword" label="Password">
                <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </FloatingLabel>

            <Button
                variant="primary"
                style={{ width: "70%", marginTop: "20px" }}
                onClick={handleLogin}
                size='lg'
            >
                Login
            </Button>
        </Form>
    )
}
