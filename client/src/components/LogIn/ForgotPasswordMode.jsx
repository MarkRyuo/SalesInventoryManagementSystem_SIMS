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
            navigate('/enable-recovery-mode'); // Navigate to the next page
        } catch (error) {
            console.error('Verification error:', error.message);
            setError('An error occurred during verification.');
        }
    };

    return (
        <Container fluid='lg'>
            <div className="Container-" style={{ border: "1px solid", borderRadius: "15px", padding: "20px" }}>
                <div>
                    <span><GoShieldLock size={20} /></span>
                    <p className="fs-4">ForgotPassword</p>
                    <p>Text Here</p>
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
                    <Button variant="primary" onClick={handleVerification}>
                        Verify Username
                    </Button>
                    {error && <p className="text-danger mt-2">{error}</p>}
                </div>
            </div>
        </Container>
    );
}

export default ForgotPasswordMode;
