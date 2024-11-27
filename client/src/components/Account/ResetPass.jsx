/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { collection, query, where, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../../services/firebase"; // Ensure this points to your Firebase config
import bcrypt from 'bcryptjs'; // Import bcrypt for hashing
import ResetPassScss from './ResetPass.module.scss' ;

const ResetPass = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const validatePhoneNumber = (number) => /^[+]?[0-9]{10,12}$/.test(number);

    const handleSendOtp = async () => {
        if (!validatePhoneNumber(phoneNumber)) {
            setError('Invalid phone number');
            return;
        }
        try {
            const response = await fetch('https://<your-firebase-functions-url>/sendOtp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phoneNumber }),
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
            const response = await fetch('https://<your-firebase-functions-url>/verifyOtp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ otp, phoneNumber }),
            });
            const result = await response.json();
            if (response.ok) {
                setSuccess('OTP verified successfully!');
                setError('');
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
            const q = query(adminsCollection, where('phoneNumber', '==', phoneNumber));
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
        <Container className="">
            <Row className={ResetPassScss.rowContainer}>
                <Col xs={12} md={6} lg={5}>
                    <h2 className="mb-4 text-center">Reset Password</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {success && <Alert variant="success">{success}</Alert>}
                    <Form>
                        <Form.Group controlId="phoneNumber" className="mb-3">
                            <Form.Label>Phone Number</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter your phone number"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                disabled={otpSent}
                            />
                        </Form.Group>

                        {!otpSent && (
                            <Button variant="primary" onClick={handleSendOtp} className="w-100">
                                Send OTP
                            </Button>
                        )}

                        {otpSent && (
                            <>
                                <Form.Group controlId="otp" className="mb-3 mt-4">
                                    <Form.Label>Enter OTP</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter the OTP sent to your phone"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                    />
                                </Form.Group>
                                <Button variant="primary" onClick={handleVerifyOtp} className="w-100 mb-3">
                                    Verify OTP
                                </Button>

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
                </Col>
            </Row>
        </Container>
    );
};

export default ResetPass;
