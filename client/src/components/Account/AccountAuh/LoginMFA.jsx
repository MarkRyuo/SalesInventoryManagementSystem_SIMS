import { useState } from 'react';
import { Form, Button, Alert, Container, Row, Col } from 'react-bootstrap';
import { getAuth, signInWithEmailAndPassword, PhoneAuthProvider, RecaptchaVerifier } from 'firebase/auth';

function LoginMFA() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [phoneCode, setPhoneCode] = useState('');
    const [error, setError] = useState('');
    const [isMFA, setIsMFA] = useState(false);
    const [verificationId, setVerificationId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [appVerifier, setAppVerifier] = useState(null); // Define appVerifier state

    const auth = getAuth(); // Get the Firebase auth instance

    // Handle email and password login
    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');  // Reset previous errors

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            // Check if MFA is enabled, if not, enroll phone number
            checkMFA(user);
        } catch (err) {
            setError(err.message || 'Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    // Check if MFA is enabled or not
    const checkMFA = (user) => {
        if (user.multiFactor && user.multiFactor.enrolledFactors.length > 0) {
            console.log('MFA is already enabled');
            setIsMFA(true); // Proceed with normal MFA flow
        } else {
            console.log('MFA is not enabled, enrolling phone...');
            // Prompt user to provide phone number for MFA enrollment
            setIsMFA(false);
            promptPhoneNumberEnrollment(user);
        }
    };

    // Prompt for phone number to enroll in MFA
    const promptPhoneNumberEnrollment = async (user) => {
        const verifier = new RecaptchaVerifier('recaptcha-container', {
            size: 'invisible',
            callback: (response) => {
                if (response) {
                    // Store appVerifier in state
                    setAppVerifier(verifier);
                    // Send phone verification code
                    sendPhoneVerificationCode(user, verifier);
                } else {
                    setError('reCAPTCHA verification failed.');
                }
            }
        }, auth);

        // Start the reCAPTCHA flow
        verifier.render();
    };

    // Send phone verification code
    const sendPhoneVerificationCode = async (user, verifier) => {
        try {
            const phoneAuthProvider = new PhoneAuthProvider(auth);
            const verificationId = await phoneAuthProvider.verifyPhoneNumber(phoneNumber, verifier);
            setVerificationId(verificationId);
        } catch (err) {
            setError(err.message || 'Failed to send phone verification code.');
        }
    };

    // Verify the phone number with the code
    const verifyPhoneNumber = async () => {
        const phoneCredential = PhoneAuthProvider.credential(verificationId, phoneCode);

        try {
            const user = auth.currentUser;
            const multiFactorSession = await user.multiFactor.getSession();
            await multiFactorSession.enroll(phoneCredential); // Enroll phone number for MFA
            console.log('Phone number enrolled successfully!');
            setIsMFA(true); // Set MFA flag to true
        } catch (err) {
            setError(err.message || 'Failed to verify the phone code.');
        }
    };

    return (
        <Container>
            <Row className="justify-content-md-center">
                <Col md={4}>
                    <h2>Login</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleLogin}>
                        <Form.Group controlId="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit" disabled={isLoading}>
                            {isLoading ? 'Logging in...' : 'Login'}
                        </Button>
                    </Form>

                    {/* Phone Number Enrollment Form */}
                    {!isMFA && (
                        <div>
                            <h3>Enter your phone number to enroll in MFA:</h3>
                            <Form.Group controlId="phoneNumber">
                                <Form.Control
                                    type="text"
                                    placeholder="Enter your phone number"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    required
                                />
                            </Form.Group>
                            <Button variant="primary" onClick={() => sendPhoneVerificationCode(auth.currentUser, appVerifier)} disabled={isLoading}>
                                {isLoading ? 'Sending Code...' : 'Send Code'}
                            </Button>
                        </div>
                    )}

                    {/* Phone Code Verification Form */}
                    {isMFA && (
                        <div>
                            <h3>Enter the verification code sent to your phone:</h3>
                            <Form.Group controlId="phoneCode">
                                <Form.Control
                                    type="text"
                                    placeholder="Enter the verification code"
                                    value={phoneCode}
                                    onChange={(e) => setPhoneCode(e.target.value)}
                                    required
                                />
                            </Form.Group>
                            <Button variant="primary" onClick={verifyPhoneNumber} disabled={isLoading}>
                                {isLoading ? 'Verifying...' : 'Verify'}
                            </Button>
                        </div>
                    )}
                </Col>
            </Row>

            {/* reCAPTCHA */}
            <div id="recaptcha-container"></div>
        </Container>
    );
}

export default LoginMFA;
