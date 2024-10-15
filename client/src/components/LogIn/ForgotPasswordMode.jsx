import { useState } from 'react';
import { Form, FloatingLabel, Button, Container } from 'react-bootstrap';
import { GoShieldLock } from 'react-icons/go';
import { useNavigate } from 'react-router-dom';
import { db } from '../../services/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

function ForgotPasswordMode() {
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleVerification = async () => {
        try {
            const adminsCollection = collection(db, 'admins');
            const q = query(adminsCollection, where('username', '==', username));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                setError('Username not found.');
                return;
            }

            // Store the admin document data temporarily (e.g., in local storage or state management)
            const adminDocument = querySnapshot.docs[0];
            localStorage.setItem('adminDocId', adminDocument.id);
            navigate('/EnableRecoveryMode'); // Navigate to the next page
        } catch (error) {
            console.error('Verification error:', error.message);
            setError('An error occurred during verification.');
        }
    };

    return (
        <Container fluid='lg' style={{border: "1px solid red", width: "100%", height: "auto", marginTop: "100px", justifyContent: 'center', display: "flex"}}>
            <div className="Container-" style={{ boxShadow: '1px 1px 5px', borderRadius: "20px", padding: "20px", height: "350px", width: "500px", display: "flex", flexDirection: 'column', gap: '10px' }}>
                <div>
                    <span><GoShieldLock size={35} /></span>
                    <p className="fs-4">ForgotPassword</p>
                    <p>Please enter your username associated with your account. We will send you a recovery link to reset your password.</p>
                </div>
                <div>
                    <FloatingLabel controlId="floatingUsername" label="Username" className="mb-3">
                        <Form.Control
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </FloatingLabel>
                    <div className="d-flex justify-content-center">
                        <Button variant="primary" size='lg' onClick={handleVerification}>
                            Verify Username
                        </Button>
                    </div>
                    {error && <p className="text-danger mt-2">{error}</p>}

                </div>
            </div>
        </Container>
    );
}

export default ForgotPasswordMode;
