import { useState } from 'react';
import { Alert, FloatingLabel, Button, Form, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import LoginStaff from '../../services/LoginStaff'; // Adjust the import path

function SLoginCard() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [showError, setShowError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);
        setLoading(true);

        try {
            await LoginStaff(username, password, navigate);
            setSuccess(true);
            setShowSuccess(true);
            setUsername('');
            setPassword('');

            // Automatically hide the success message and navigate after 2.5 seconds
            setTimeout(() => {
                setShowSuccess(false);
                navigate('/SDashboard'); 
            }, 2500); // Delay for success message display
        } catch (error) {
            setError(error.message); // Display the error message
            setShowError(true);
            console.log("Login failed:", error.message); // Log for error
            setUsername('');
            setPassword('');

            // Automatically clear the error after 3 seconds with a smooth fade-out
            setTimeout(() => {
                setShowError(false);
            }, 3000);

            // Clear the error message from state after the transition ends
            setTimeout(() => {
                setError(null);
            }, 3500);
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    return (
        <Form onSubmit={handleLogin}>
            {/* Display success message if login is successful */}
            {success && showSuccess && (
                <Alert
                    variant="success"
                    style={{
                        opacity: 1,
                        transition: 'opacity 0.5s ease-in-out',
                        marginBottom: '20px'
                    }}
                >
                    <Alert.Heading>Login Successful!</Alert.Heading>
                    <p>You are being redirected to your dashboard...</p>
                </Alert>
            )}

            {/* Display error message if login fails */}
            {error && showError && (
                <Alert
                    variant="danger"
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
            <FloatingLabel controlId="floatingInput" label="Username" className="mb-4">
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
                type='submit'
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
        </Form>
    );
}

export default SLoginCard;
