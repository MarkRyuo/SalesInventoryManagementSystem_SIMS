import { useState, useEffect } from 'react';
import { Form, FloatingLabel, Button, Container, Alert, Spinner } from 'react-bootstrap';
//?Icons
import { GoShieldLock } from 'react-icons/go';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
//? Service
import { db } from '../../services/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
//? Css
import ResetModecss from './SCSS/ResetMode.module.scss' ;

function ForgotPasswordMode() {
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(''); //* State to manage success message
    const [showError, setShowError] = useState(false); //* State to manage error alert visibility
    const [loading, setLoading] = useState(false); //* State for loading indicator
    const navigate = useNavigate();

    const handleVerification = async () => {
        setLoading(true); //* Start loading
        setError(''); //* Clear any previous errors
        setSuccess(''); //* Clear previous success messages
        try {
            const adminsCollection = collection(db, 'admins');
            const q = query(adminsCollection, where('username', '==', username));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                setError('Username not found.');
                setShowError(true); //* Show error alert
                setUsername(''); //* Clear the input field
                return;
            }

            //* Store the admin document data temporarily (e.g., in local storage or state management)
            const adminDocument = querySnapshot.docs[0];
            localStorage.setItem('adminDocId', adminDocument.id);

            //* Set success message
            setSuccess('Username verified successfully. Redirecting to recovery process...');
            setTimeout(() => {
                navigate('/EnableRecoveryMode'); //* Navigate to the next page
            }, 2000); //* Redirect after 2 seconds
        } catch (error) {
            console.error('Verification error:', error.message);
            setError('An error occurred during verification.');
            setShowError(true); //* Show error alert
            setUsername(''); //* Clear the input field
        } finally {
            setLoading(false); //* Stop loading regardless of the outcome
        }
    };

    //* Automatically clear the error and success messages after 3 seconds with a smooth fade-out
    useEffect(() => {
        if (showError) {
            const timer = setTimeout(() => {
                setShowError(false);
                setError('');
            }, 3000);
            return () => clearTimeout(timer); //* Cleanup the timer
        }
    }, [showError]);

    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => {
                setSuccess('');
            }, 3000);
            return () => clearTimeout(timer); //* Cleanup the timer
        }
    }, [success]);

    return (
        <div className={ResetModecss.mainContainer}>
            <Container fluid='lg' className={ResetModecss.containerMode}>
                <div className={ResetModecss.containerContent}>
                    <div>
                        <Button variant="link" onClick={() => navigate('/')} size='lg' className='p-0'>
                            <FaArrowLeft size={25} /> 
                        </Button>
                    </div>
                    <div>
                        <span><GoShieldLock size={35} /></span>
                        <p className="fs-4">Forgot Password</p>
                    </div>
                    <p>Forgot your password? Don’t worry! Just enter your username, and we’ll guide you through the recovery process.</p>
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
                                    transition: 'opacity 0.5s ease-in',
                                    position: 'relative'
                                }}
                            >
                                <Alert.Heading>Error!</Alert.Heading>
                                <p>{error}</p>
                            </Alert>
                        )}

                        {/* Display success message if verification succeeds */}
                        {success && (
                            <Alert
                                variant="success"
                                style={{
                                    opacity: success ? 1 : 0,
                                    transition: 'opacity 0.5s ease-in',
                                    position: 'relative'
                                }}
                            >
                                <Alert.Heading>Success!</Alert.Heading>
                                <p>{success}</p>
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
                            <Button variant="primary" size='lg' onClick={handleVerification} disabled={loading}>
                                {loading ? (
                                    <>
                                        <Spinner animation="border" size="sm" role="status" aria-hidden="true" /> Verifying...
                                    </>
                                ) : (
                                    'Verify Username'
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
}

export default ForgotPasswordMode;
