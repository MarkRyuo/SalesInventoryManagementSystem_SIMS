import { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { auth, googleProvider } from '../../../services/firebase'; // Firebase config
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import LogInCardPagecss from './LandingPageCards.module.scss';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const LogInCardPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    // Admin Login (Email/Password)
    const handleAdminLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Store admin ID
            localStorage.setItem('adminId', user.uid);

            alert('Admin login successful!');
            navigate('/DashboardPage'); // Redirect to Admin Dashboard
        } catch (error) {
            console.error('Login error:', error.message);
            setError('Invalid admin email or password.');
        }
    };

    // Staff Login (Username/Password)
    const handleStaffLogin = async (e) => {
        e.preventDefault();
        setError('');

        // Replace this with actual staff login logic (e.g., Firebase or custom API)
        const validStaff = {
            username: 'staff123',
            password: 'password123', // Dummy credentials
        };

        if (username === validStaff.username && password === validStaff.password) {
            localStorage.setItem('staffId', username); // Store staff username
            alert('Staff login successful!');
            navigate('/SDashboard'); // Redirect to Staff Dashboard
        } else {
            setError('Invalid staff username or password.');
        }
    };

    // Google Sign-In for Admin
    const handleGoogleSignIn = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            // Store admin ID
            localStorage.setItem('adminId', user.uid);

            alert('Google login successful!');
            navigate('/DashboardPage'); // Redirect to Admin Dashboard
        } catch (error) {
            console.error('Google Sign-In error:', error.message);
            setError('Failed to log in with Google.');
        }
    };

    return (
        <div className={LogInCardPagecss.LogInContainer}>
            <div className={LogInCardPagecss.LoginText}>
                <h1>Manage your entire Inventory in a single System</h1>
            </div>
            <div className={LogInCardPagecss.LoginFormContainer}>
                <div className={LogInCardPagecss.LoginForm}>
                    <h2>Admin Login</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleAdminLogin}>
                        <Form.Group className="mb-3" controlId="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter admin email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="password">
                            <Form.Label>Password</Form.Label>
                            <div style={{ position: 'relative' }}>
                                <Form.Control
                                    type={isPasswordVisible ? 'text' : 'password'}
                                    placeholder="Enter password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <span
                                    onClick={togglePasswordVisibility}
                                    style={{
                                        position: 'absolute',
                                        right: '10px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        cursor: 'pointer',
                                    }}
                                >
                                    {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>
                        </Form.Group>
                        <Button variant="primary" type="submit" className="w-100">
                            Admin Login
                        </Button>
                    </Form>
                    <hr />
                    <Button variant="danger" onClick={handleGoogleSignIn} className="w-100">
                        Sign in with Google
                    </Button>
                </div>
                <div className={LogInCardPagecss.LoginForm}>
                    <h2>Staff Login</h2>
                    <Form onSubmit={handleStaffLogin}>
                        <Form.Group className="mb-3" controlId="username">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter staff username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="password">
                            <Form.Label>Password</Form.Label>
                            <div style={{ position: 'relative' }}>
                                <Form.Control
                                    type={isPasswordVisible ? 'text' : 'password'}
                                    placeholder="Enter password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <span
                                    onClick={togglePasswordVisibility}
                                    style={{
                                        position: 'absolute',
                                        right: '10px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        cursor: 'pointer',
                                    }}
                                >
                                    {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>
                        </Form.Group>
                        <Button variant="secondary" type="submit" className="w-100">
                            Staff Login
                        </Button>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default LogInCardPage;
