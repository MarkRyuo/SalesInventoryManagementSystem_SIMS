import { useState, useEffect } from 'react';
import { Form, FloatingLabel, Button, Container, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
//? Icon
import { FaLock } from 'react-icons/fa';
//? Services
import { db } from '../../services/firebase';
import { doc, getDoc } from 'firebase/firestore';
//? Css
import ResetModecss from './SCSS/ResetMode.module.scss';

function EnableRecoveryMode() {
    const [customQuestions, setCustomQuestions] = useState([]);
    const [customAnswers, setCustomAnswers] = useState({});
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(''); //* State to manage success message
    const [showError, setShowError] = useState(false); //* State to manage error alert visibility
    const [loading, setLoading] = useState(false); //* State for loading indicator
    const navigate = useNavigate();
    const adminDocId = localStorage.getItem('adminDocId');

    useEffect(() => {
        const fetchQuestions = async () => {
            if (!adminDocId) return;
            const adminDocRef = doc(db, 'admins', adminDocId);
            const docSnapshot = await getDoc(adminDocRef);

            if (docSnapshot.exists()) {
                const recoveryQuestions = docSnapshot.data().recoveryQuestions || [];
                const selectedQuestions = recoveryQuestions.sort(() => 0.5 - Math.random()).slice(0, 2);
                setCustomQuestions(selectedQuestions);
            }
        };

        fetchQuestions();
    }, [adminDocId]);

    const handleAnswerChange = (question, answer) => {
        setCustomAnswers((prev) => ({ ...prev, [question]: answer }));
    };

    const checkAnswers = async () => {
        setLoading(true); //* Start loading
        setError(''); //* Clear any previous errors
        setSuccess(''); //* Clear previous success messages
        try {
            const adminDocRef = doc(db, 'admins', adminDocId);
            const docSnapshot = await getDoc(adminDocRef);
            const storedAnswers = docSnapshot.data().answers || {};
            let correctCount = 0;

            customQuestions.forEach((question) => {
                if (customAnswers[question] === storedAnswers[question]) {
                    correctCount++;
                }
            });

            if (correctCount >= 2) {
                setSuccess('Answers verified successfully. Redirecting to reset password...');
                setTimeout(() => {
                    navigate('/ResetPasswordMode'); //* Navigate to reset password page
                }, 2000); //* Redirect after 2 seconds
            } else {
                setError('Incorrect answers to the security questions.');
                setShowError(true); //* Show error alert
            }
        } catch (error) {
            console.error('Verification error:', error.message);
            setError('An error occurred during verification.');
            setShowError(true); //* Show error alert
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
                        <span><FaLock size={30} /></span>
                        <p className="fs-4">Enable Recovery Mode</p>
                        <p>To continue the password recovery process, please answer the security questions below. Make sure to enter the answers you previously set up. You need to answer at least two questions correctly to proceed.</p>
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

                        {customQuestions.map((question, index) => (
                            <FloatingLabel key={index} controlId={`floatingAnswer${index}`} label={question} className="mb-3" style={{width: '100%', minWidth: '400px'}}>
                                <Form.Control
                                    type="text"
                                    placeholder="Answer"
                                    onChange={(e) => handleAnswerChange(question, e.target.value)}
                                />
                            </FloatingLabel>
                        ))}
                        <div className="d-flex justify-content-center mb-3">
                            <Button variant="primary" onClick={checkAnswers} disabled={loading} size='lg'>
                                {loading ? (
                                    <>
                                        <Spinner animation="border" size="sm" role="status" aria-hidden="true" /> Verifying...
                                    </>
                                ) : (
                                    'Verify Answers'
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
}

export default EnableRecoveryMode;
