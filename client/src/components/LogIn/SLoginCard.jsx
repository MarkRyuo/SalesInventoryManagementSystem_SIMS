import { useState } from 'react';
import { Button, Form, FloatingLabel, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import LoginStaff from '../../services/LoginStaff'; // Adjust the import path

function SLoginCard() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);
    const [showError, setShowError] = useState(false);
    const [loading, setLoading] = useState(false); // State to manage loading
    const [success, setSuccess] = useState(false); // State for success message
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMessage(null);
        setSuccess(false);
        setLoading(true);

        try {
            await LoginStaff(username, password, navigate);
            setSuccess(true);
            setUsername('');
            setPassword('');
            setTimeout(() => {
                navigate('/SDashboard'); // Adjust this route as needed
            }, 2500); // Redirect after a delay for success message display
        } catch (error) {
            setErrorMessage(error.message);
            setShowError(true);

            // Clear username and password inputs on failure
            setUsername('');
            setPassword('');

            // Hide the error message after 3 seconds with a fade-out effect
            setTimeout(() => {
                setShowError(false);
            }, 3000);

            // Clear the error message state after the fade-out completes
            setTimeout(() => {
                setErrorMessage(null);
            }, 3500);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form onSubmit={handleLogin}>
            {/* Success Message */}
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
                    <p>You are being redirected to your dashboard...</p>
                </Alert>
            )}

            {/* Error Message */}
            {errorMessage && (
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
                        {errorMessage} Please check your username and password and try again.
                    </p>
                </Alert>
            )}

            {/* Username Input */}
            <FloatingLabel controlId="floatingInput" label="Username" className="mb-4">
                <Form.Control
                    type="text"
                    placeholder='Username'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={loading} // Disable input during loading
                />
            </FloatingLabel>

            {/* Password Input */}
            <FloatingLabel controlId="floatingPassword" label="Password">
                <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading} // Disable input during loading
                />
            </FloatingLabel>

            {/* Login Button */}
            <Button
                variant="primary"
                style={{ width: "70%", marginTop: "20px" }}
                type='submit'
                size='lg'
                disabled={loading} // Disable button during loading
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
