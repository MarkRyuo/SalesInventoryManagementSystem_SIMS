import { useState} from 'react';
import { Alert, FloatingLabel, Button, Form } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import LoginUser from '../../services/LoginUser'; // Import the LoginUser function

export const LoginCard = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleLogin = async () => {
        try {
            // Attempt to log in using the provided username and password
            await LoginUser(username, password);
            navigate('/DashboardPage'); // Navigate to the dashboard if successful
        } catch (error) {
            // Handle login errors (e.g., incorrect username or password)
            setError(error.message);

            // Automatically clear the error after 2 seconds
            setTimeout(() => {
                setError(null);
            }, 2000);
        }
    };

    return (
        <Form>
            {/* Display error message if login fails */}
            {error && (
                <Alert variant="danger" onClose={() => setError(null)} dismissible>
                    <Alert.Heading>Login Failed</Alert.Heading>
                    <p>
                        {error} Please check your username and password and try again.
                    </p>
                </Alert>
            )}

            {/* Username */}
            <FloatingLabel controlId="floatingInput" label="Username" className="mb-4">
                <Form.Control
                    type="text"
                    placeholder='Username'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
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

            {/* Login Button */}
            <Button
                variant="primary"
                style={{ width: "70%", marginTop: "20px" }}
                onClick={handleLogin}
                size='lg'>
                Login
            </Button>

            {/* Forgot Password Link */}
            <Link
                to="/ForgotPasswordMode"
                style={{
                    display: 'block',
                    textAlign: 'center',
                    marginTop: '10px',
                    textDecoration: 'none',
                    color: '#007bff'
                }}>
                Forgot Password?
            </Link>
        </Form>
    );
};

export default LoginCard;
