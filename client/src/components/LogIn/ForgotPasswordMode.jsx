import { useState, useEffect } from 'react';
import { Form, FloatingLabel, Button, Container, Alert } from 'react-bootstrap';
import { GoShieldLock } from 'react-icons/go';
import { useNavigate } from 'react-router-dom';
import { db } from '../../services/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

function ForgotPasswordMode() {
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const [showError, setShowError] = useState(false); // State to manage error alert visibility
    const navigate = useNavigate();

    const handleVerification = async () => {
        try {
            const adminsCollection = collection(db, 'admins');
            const q = query(adminsCollection, where('username', '==', username));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                setError('Username not found.');
                setShowError(true); // Show error alert
                setUsername(''); // Clear the input field
                return;
            }

            // Store the admin document data temporarily (e.g., in local storage or state management)
            const adminDocument = querySnapshot.docs[0];
            localStorage.setItem('adminDocId', adminDocument.id);
            navigate('/EnableRecoveryMode'); // Navigate to the next page
        } catch (error) {
            console.error('Verification error:', error.message);
            setError('An error occurred during verification.');
            setShowError(true); // Show error alert
            setUsername(''); // Clear the input field
        }
    };

    // Automatically clear the error after 3 seconds with a smooth fade-out
    useEffect(() => {
        if (showError) {
            const timer = setTimeout(() => {
                setShowError(false);
            }, 3000);
            return () => clearTimeout(timer); // Cleanup the timer
        }
    }, [showError]);

    return (
        <Container fluid='lg' style={{ width: "100%", height: "auto", marginTop: "100px", justifyContent: 'center', display: "flex" }}>
            <div className="Container-" style={{ boxShadow: '1px 1px 5px', borderRadius: "20px", padding: "20px", height: "auto", width: "500px", display: "flex", flexDirection: 'column', gap: '10px' }}>
                <div>
                    <span><GoShieldLock size={35} /></span>
                    <p className="fs-4">Forgot Password</p>
                    <p>Forgot your password? Dont worry! Just enter your username, and well guide you through the recovery process.</p>
                </div>
                <div>
                    {/* Display error message if verification fails */}
                    {error && (
                        <Alert
                            variant="danger"
                            show={showError}
                            onClose={() => setShowError(false)}
                            dismissible
                            style={{
                                opacity: showError ? 1 : 0,
                                transition: 'opacity 0.5s ease-in', // Set fade-in duration here
                                position: 'relative' // Ensure alert appears over other elements
                            }}
                        >
                            <Alert.Heading>Error!</Alert.Heading>
                            <p>{error}</p>
                        </Alert>
                    )}

                    <FloatingLabel controlId="floatingUsername" label="Username" className="mb-3">
                        <Form.Control
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </FloatingLabel>
                    <div className="d-flex justify-content-center mb-3">
                        <Button variant="primary" size='lg' onClick={handleVerification}>
                            Verify Username
                        </Button>
                    </div>
                </div>
            </div>
        </Container>
    );
}

export default ForgotPasswordMode;
