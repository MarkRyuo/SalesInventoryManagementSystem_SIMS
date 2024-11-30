import { useState } from 'react';
import { FloatingLabel, Button, Form, Spinner, Modal } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import unifiedLogin from '../../services/UnifiedLogIn'; // Import the unifiedLogin function
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // You need to install react-icons

export const LoginCard = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    const handleLogin = async () => {
        setLoading(true);
        setSuccess(false);
        setError(null);
        try {
            await unifiedLogin(username, password, navigate);
            setSuccess(true);
            setUsername('');
            setPassword('');
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Success Modal */}
            <Modal show={success} onHide={() => setSuccess(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Login Successful</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Redirecting to your Dashboard...</p>
                </Modal.Body>
            </Modal>

            {/* Error Modal */}
            <Modal show={!!error} onHide={() => setError(null)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Login Failed</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>{error} Please check your credentials and try again.</p>
                </Modal.Body>
            </Modal>

            <Form>
                {/* Username */}
                <FloatingLabel controlId="floatingInput" label="Username" className="mb-4">
                    <Form.Control
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        disabled={loading}
                    />
                </FloatingLabel>

                {/* Password */}
                <FloatingLabel controlId="floatingPassword" label="Password" className="position-relative">
                    <Form.Control
                        type={isPasswordVisible ? 'text' : 'password'}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                    />
                    <span
                        onClick={togglePasswordVisibility}
                        style={{
                            position: 'absolute',
                            right: '43px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            cursor: 'pointer',
                        }}
                    >
                        {isPasswordVisible ? <FaEye size={20} /> : <FaEyeSlash size={20} />}
                    </span>
                </FloatingLabel>

                {/* Login Button */}
                <Button
                    variant="primary"
                    style={{ width: '70%', marginTop: '20px' }}
                    onClick={handleLogin}
                    size="lg"
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <Spinner animation="grow" variant="primary" size="sm" role="status" aria-hidden="true" />{' '}
                            Logging in...
                        </>
                    ) : (
                        'Login'
                    )}
                </Button>

                {/* Forgot Password Link */}
                <Link
                    to="/ResetPass"
                    style={{
                        display: 'block',
                        textAlign: 'center',
                        marginTop: '10px',
                        textDecoration: 'none',
                        color: '#007bff',
                    }}
                >
                    Forgot Password?
                </Link>
            </Form>
        </>
    );
};

export default LoginCard;
