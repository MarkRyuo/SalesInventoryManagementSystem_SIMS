import { useState } from 'react';
import { Alert, FloatingLabel, Button, Form, Spinner } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import unifiedLogin from '../../services/UnifiedLogIn'; // Import the unifiedLogin function

export const LoginCard = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [showError, setShowError] = useState(false);
    const [loading, setLoading] = useState(false); // State for loading indicator
    const [success, setSuccess] = useState(false); // State for success message

    const handleLogin = async () => {
        setLoading(true); // Start loading
        setSuccess(false); // Reset success message
        setError(null); // Reset error message
        try {
            // Attempt to log in using the provided username and password
            await unifiedLogin(username, password, navigate);
            setSuccess(true); // Set success state
            setUsername(''); // Clear the username input field
            setPassword(''); // Clear the password input field
            setTimeout(() => {
                // The navigation will be handled by unifiedLogin
            }, 2000); // Delay for success message display
        } catch (error) {
            // Handle login errors (e.g., incorrect username or password)
            setError(error.message);
            setShowError(true);

            // Clear username and password input fields when login fails
            setUsername('');
            setPassword('');

            // Automatically clear the error after 3 seconds with a smooth fade-out
            setTimeout(() => {
                setShowError(false);
            }, 3000);

            // Clear the error message from state after the transition ends
            setTimeout(() => {
                setError(null);
            }, 3500); // Slightly longer to ensure the fade-out completes
        } finally {
            setLoading(false); // Stop loading
        }
    };

    return (
        <Form>
            {/* Display success message if login is successful */}
            {success && (
                <Alert
                    variant="success"
                    style={{
                        opacity: 1,
                        transition: 'opacity 0.5s ease-in-out',
                        marginBottom: '20px'
                    }}
                >
                    <Alert.Heading>Login Successful!</Alert.Heading>
                    <p>Redirecting to your Dashboard...</p>
                </Alert>
            )}

            {/* Display error message if login fails */}
            {error && (
                <Alert
                    variant="danger"
                    show={showError}
                    onClose={() => setShowError(false)}
                    dismissible
                    style={{
                        opacity: showError ? 1 : 0,
                        transition: 'opacity 0.5s ease-in-out'
                    }}
                >
                    <Alert.Heading>Login Failed</Alert.Heading>
                    <p>
                        {error} Please check your username and password and try again.
                    </p>
                </Alert>
            )}

            {/* Username */}
            <FloatingLabel controlId="floatingInput" label="Username" className="mb-4" >
                <Form.Control
                    type="text"
                    placeholder='Username'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={loading} // Disable input while loading
                />
            </FloatingLabel>

            {/* Password */}
            <FloatingLabel controlId="floatingPassword" label="Password">
                <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading} // Disable input while loading
                />
            </FloatingLabel>

            {/* Login Button */}
            <Button
                variant="primary"
                style={{ width: "70%", marginTop: "20px" }}
                onClick={handleLogin}
                size='lg'
                disabled={loading} // Disable button while loading
            >
                {loading ? (
                    <>
                        <Spinner animation="border" size="sm" role="status" aria-hidden="true" /> Logging in...
                    </>
                ) : (
                    'Login'
                )}
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
