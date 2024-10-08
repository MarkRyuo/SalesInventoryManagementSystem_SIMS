import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { Button, Form } from 'react-bootstrap';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebaseConfig'; // Ensure correct path
import { signInWithEmailAndPassword } from 'firebase/auth';

export const LoginCard = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/DashboardPage');
        } catch (error) {
            setError('Invalid email or password. Please try again.');
            console.error('Error during login:', error);
        }
    };

    return (
        <Form onSubmit={handleLogin}>
            {/* Email or Username */}
            <FloatingLabel controlId="floatingInput" label="Email or Username" className="mb-4">
                <Form.Control
                    type="text"
                    placeholder="Email or Username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </FloatingLabel>

            {/* Password */}
            <FloatingLabel controlId="floatingPassword" label="Password">
                <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </FloatingLabel>

            {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

            {/* Button of Login */}
            <Button
                variant="primary"
                style={{ width: '70%', marginTop: '20px' }}
                type="submit"
                size="lg"
            >
                Login
            </Button>
        </Form>
    );
};
