/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { collection, query, where, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../../services/firebase"; // Ensure this points to your Firebase config
import bcrypt from 'bcryptjs'; // Import bcrypt for hashing
import ResetPassScss from './ResetPass.module.scss';
import { Link } from 'react-router-dom'
import { IoArrowBack } from "react-icons/io5";
import { PiShieldWarningFill } from "react-icons/pi";

const ResetPass = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false); // State for OTP verification
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    

    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);


    const handleSendOtp = async () => {
        if (!validateEmail(email)) {  // Use email validation instead of phone number validation
            setError('Invalid email address');
            return;
        }
        try {
            const response = await fetch(' https://api-hqnwrfpmoa-uc.a.run.app', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }), // Use email here
            });

            const result = await response.json();
            if (response.ok) {
                setOtpSent(true);
                setSuccess('OTP sent successfully!');
                setError('');
            } else {
                setError(result.error);
            }
        } catch (error) {
            setError('Error sending OTP.');
        }
    };

    const handleVerifyOtp = async () => {
        try {
            const response = await fetch(' https://api-hqnwrfpmoa-uc.a.run.app', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ otp, email }), // Use email here
            });

            const result = await response.json();
            if (response.ok) {
                setSuccess('OTP verified successfully!');
                setError('');
                setOtpVerified(true); // OTP verified, now show the new password input
            } else {
                setError(result.error);
            }
        } catch (error) {
            setError('Error verifying OTP.');
        }
    };

    const handleResetPassword = async () => {
        if (!newPassword) {
            setError('Password is required');
            return;
        }

        try {
            // Hash the new password using bcrypt before saving it
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            // Query Firestore for the admin with the matching phone number
            const adminsCollection = collection(db, 'admins');
            const q = query(adminsCollection, where('email', '==', email)); // Search by email
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                setError('Phone number not found');
                return;
            }

            // Update the password for the matched document
            querySnapshot.forEach(async (doc) => {
                const adminRef = doc.ref;
                await updateDoc(adminRef, { password: hashedPassword });
            });

            setSuccess('Password reset successfully!');
            setError('');
        } catch (error) {
            console.error('Error resetting password:', error);
            setError('Error resetting password.');
        }
    };

    return (
        <Container fluid style={{ background: "radial-gradient(500px at 0.7% 3.4%, rgb(164, 231, 192) 0%, rgb(245, 255, 244) 80%)" }}>
            <Row className={ResetPassScss.rowContainer}>
                <Col xs={12} md={8} lg={4} className={ResetPassScss.colContainer}>
                    <div><PiShieldWarningFill size={70} /></div>
                    <h2 className="mb-2 text-center">Forgot Password</h2>
                    <p className='fs-6 m-0 text-center'>Enter your Email and we'll send you a OTP to reset your password.</p>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {success && <Alert variant="success">{success}</Alert>}
                    <Form>
                        <Form.Group controlId="email" className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={otpSent || otpVerified}
                            />
                        </Form.Group>

                        {!otpSent && (
                            <Button variant="primary" onClick={handleSendOtp} className="w-100">
                                Send OTP
                            </Button>
                        )}

                        {otpSent && !otpVerified && (
                            <>
                                <Form.Group controlId="otp" className="mb-3 mt-4">
                                    <Form.Label>Enter OTP</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter the OTP sent to your email"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                    />

                                </Form.Group>
                                <Button variant="primary" onClick={handleVerifyOtp} className="w-100 mb-3">
                                    Verify OTP
                                </Button>
                            </>
                        )}

                        {otpSent && otpVerified && (
                            <>
                                <Form.Group controlId="newPassword" className="mb-3">
                                    <Form.Label>New Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Enter new password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                </Form.Group>
                                <Button variant="success" onClick={handleResetPassword} className="w-100">
                                    Reset Password
                                </Button>
                            </>
                        )}
                    </Form>
                    <Link to={"/"} style={{ textDecoration: 'none', color: '#130e01' }}><IoArrowBack />Back to Login</Link>
                </Col>
            </Row>
        </Container>
    );
};

export default ResetPass;
