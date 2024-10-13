import { useEffect, useState } from 'react';
import { Button, Form, FloatingLabel } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { db } from '../../services/firebase'; // Update path as needed
import { collection, query, where, getDocs } from 'firebase/firestore';

function SLoginCard() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    // Example useEffect to check for stored credentials or perform any initial setup
    useEffect(() => {
        // Here you can check for saved login credentials or perform any initialization
        // This is just an example; you might check localStorage or a similar mechanism
        const savedUsername = localStorage.getItem('username') || '';
        setUsername(savedUsername);
    }, []); // Runs only once when the component mounts

    const handleLogin = async (e) => {
        e.preventDefault(); // Prevent default form submission
        setErrorMessage(''); // Clear any previous error messages

        try {
            const staffCollection = collection(db, 'staffs');
            const q = query(staffCollection, where('username', '==', username));
            const snapshot = await getDocs(q);

            if (snapshot.empty) {
                setErrorMessage('No such user found');
                return;
            }

            const staffData = snapshot.docs[0].data();

            // Check if the password matches
            if (staffData.password !== password) {
                setErrorMessage('Incorrect password');
                return;
            }

            // Check if the account is active
            if (!staffData.active) {
                setErrorMessage('Your account is inactive. Please contact an administrator.');
                return;
            }

            // If login is successful, navigate to the dashboard
            navigate('/SDashboard');
        } catch (error) {
            console.error('Error logging in:', error);
            setErrorMessage('Error logging in. Please try again.');
        }
    };

    return (
        <>
            <Form onSubmit={handleLogin}>
                {/* Username */}
                <FloatingLabel controlId="floatingInput" label="Username" className="mb-4">
                    <Form.Control
                        type="text"
                        placeholder='Username'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)} // Update username state
                    />
                </FloatingLabel>

                {/* Password */}
                <FloatingLabel controlId="floatingPassword" label="Password">
                    <Form.Control
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} // Update password state
                    />
                </FloatingLabel>

                {/* Error Message */}
                {errorMessage && <div className="text-danger mb-3">{errorMessage}</div>}

                {/* Button of Login */}
                <Button
                    variant="primary"
                    style={{ width: "70%", marginTop: "20px" }}
                    type="submit" // Change to submit
                    size='lg'>
                    Login
                </Button>
            </Form>
        </>
    );
}

export default SLoginCard;
