import { useState } from 'react';
import { Button, Form, FloatingLabel } from 'react-bootstrap';
import { db } from '../../services/firebase'; // Update path as needed
import { addDoc, collection } from 'firebase/firestore';

const StaffComp = () => {
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [gender, setGender] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleAddStaff = async (e) => {
        e.preventDefault(); // Prevent default form submission
        try {
            const staffCollection = collection(db, 'staffs');

            // Add new staff to Firestore
            await addDoc(staffCollection, {
                firstname,
                lastname,
                gender,
                username,
                password, // Ensure password management is secure in production
            });

            alert('Staff member added successfully!');
            setFirstname('');
            setLastname('');
            setGender('');
            setUsername('');
            setPassword('');
        } catch (error) {
            console.error('Error adding staff:', error);
            alert('Error adding staff. Please try again.');
        }
    };

    return (
        <div>
            <h1>Staff Management</h1>

            <Form onSubmit={handleAddStaff}>
                <FloatingLabel controlId="floatingFirstname" label="First Name" className="mb-3">
                    <Form.Control
                        type="text"
                        placeholder="First Name"
                        value={firstname}
                        onChange={(e) => setFirstname(e.target.value)}
                    />
                </FloatingLabel>

                <FloatingLabel controlId="floatingLastname" label="Last Name" className="mb-3">
                    <Form.Control
                        type="text"
                        placeholder="Last Name"
                        value={lastname}
                        onChange={(e) => setLastname(e.target.value)}
                    />
                </FloatingLabel>

                <FloatingLabel controlId="floatingGender" label="Gender" className="mb-3">
                    <Form.Control
                        type="text"
                        placeholder="Gender"
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                    />
                </FloatingLabel>

                <FloatingLabel controlId="floatingUsername" label="Username" className="mb-3">
                    <Form.Control
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </FloatingLabel>

                <FloatingLabel controlId="floatingPassword" label="Password" className="mb-3">
                    <Form.Control
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </FloatingLabel>

                <Button variant="primary" type="submit">
                    Add Staff
                </Button>
            </Form>
        </div>
    );
};

export default StaffComp;
