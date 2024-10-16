import { useEffect, useState } from 'react';
import { Button, Form, FloatingLabel, Table, Row, Col } from 'react-bootstrap';
import { db } from '../../services/firebase'; // Update path as needed
import { addDoc, collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';

const StaffComp = () => {
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [gender, setGender] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [active, setActive] = useState(true); // Default active status
    const [staffList, setStaffList] = useState([]);
    const [editingStaffId, setEditingStaffId] = useState(null); // Track staff being edited
    const [errorMessage, setErrorMessage] = useState(''); // For error messages

    // Password requirement states
    const [lengthRequirement, setLengthRequirement] = useState(false);
    const [uppercaseRequirement, setUppercaseRequirement] = useState(false);
    const [lowercaseRequirement, setLowercaseRequirement] = useState(false);
    const [numberRequirement, setNumberRequirement] = useState(false);
    const [specialCharRequirement, setSpecialCharRequirement] = useState(false);

    const validatePassword = (password) => {
        setLengthRequirement(password.length >= 8);
        setUppercaseRequirement(/[A-Z]/.test(password));
        setLowercaseRequirement(/[a-z]/.test(password));
        setNumberRequirement(/\d/.test(password));
        setSpecialCharRequirement(/[!@#$%^&*]/.test(password));
    };

    const handleAddStaff = async (e) => {
        e.preventDefault(); // Prevent default form submission

        // Check if all requirements are met
        if (!(lengthRequirement && uppercaseRequirement && lowercaseRequirement && numberRequirement && specialCharRequirement)) {
            setErrorMessage('Password must meet all requirements.');
            return;
        }

        try {
            const staffCollection = collection(db, 'staffs');

            // If editing, update the staff, otherwise add a new one
            if (editingStaffId) {
                const staffDoc = doc(db, 'staffs', editingStaffId);
                await updateDoc(staffDoc, {
                    firstname,
                    lastname,
                    gender,
                    username,
                    password, // Ensure password management is secure in production
                    active, // Update active status
                });
                alert('Staff member updated successfully!');
            } else {
                await addDoc(staffCollection, {
                    firstname,
                    lastname,
                    gender,
                    username,
                    password, // Ensure password management is secure in production
                    active, // Set initial active status
                });
                alert('Staff member added successfully!');
            }

            // Clear form and refresh staff list
            clearForm();
            fetchStaff();
        } catch (error) {
            console.error('Error adding/updating staff:', error);
            alert('Error processing staff. Please try again.');
        }
    };

    const clearForm = () => {
        setFirstname('');
        setLastname('');
        setGender('');
        setUsername('');
        setPassword('');
        setActive(true); // Reset active status
        setEditingStaffId(null); // Reset editing state
        setErrorMessage(''); // Clear error message

        // Reset password requirement states
        setLengthRequirement(false);
        setUppercaseRequirement(false);
        setLowercaseRequirement(false);
        setNumberRequirement(false);
        setSpecialCharRequirement(false);
    };

    const fetchStaff = async () => {
        try {
            const staffCollection = collection(db, 'staffs');
            const snapshot = await getDocs(staffCollection);
            const staffData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setStaffList(staffData);
        } catch (error) {
            console.error('Error fetching staff:', error);
        }
    };

    const handleEditStaff = (staff) => {
        setFirstname(staff.firstname);
        setLastname(staff.lastname);
        setGender(staff.gender);
        setUsername(staff.username);
        setPassword(staff.password);
        setActive(staff.active); // Set active status for editing
        setEditingStaffId(staff.id); // Set the ID of the staff being edited
        setErrorMessage(''); // Clear error message

        // Reset password requirement states
        setLengthRequirement(false);
        setUppercaseRequirement(false);
        setLowercaseRequirement(false);
        setNumberRequirement(false);
        setSpecialCharRequirement(false);
    };

    const handleDeleteStaff = async (staffId) => {
        if (window.confirm('Are you sure you want to delete this staff member?')) {
            try {
                const staffDoc = doc(db, 'staffs', staffId);
                await deleteDoc(staffDoc);
                alert('Staff member deleted successfully!');
                fetchStaff(); // Refresh the staff list after deletion
            } catch (error) {
                console.error('Error deleting staff:', error);
                alert('Error deleting staff. Please try again.');
            }
        }
    };

    useEffect(() => {
        fetchStaff(); // Fetch staff on component mount
    }, []);

    return (
        <Row style={{display: 'flex', width: "100%", margin: 0, justifyContent: "space-between"}}>
            <Col className='p-0' lg={5} md={12} sm={12}>
                <Form onSubmit={handleAddStaff} style={{ border: "1px solid green", padding: "20px", width: '100%'}}>
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
                            onChange={(e) => {
                                setPassword(e.target.value);
                                validatePassword(e.target.value); // Validate password as user types
                            }}
                        />
                    </FloatingLabel>

                    {errorMessage && <p className="text-danger">{errorMessage}</p>} {/* Display error message */}

                    {/* Password requirements */}
                    <p className={lengthRequirement ? 'text-success' : 'text-danger'}>
                        {lengthRequirement ? '✓ At least 8 characters' : '✗ At least 8 characters'}
                    </p>
                    <p className={uppercaseRequirement ? 'text-success' : 'text-danger'}>
                        {uppercaseRequirement ? '✓ At least one uppercase letter' : '✗ At least one uppercase letter'}
                    </p>
                    <p className={lowercaseRequirement ? 'text-success' : 'text-danger'}>
                        {lowercaseRequirement ? '✓ At least one lowercase letter' : '✗ At least one lowercase letter'}
                    </p>
                    <p className={numberRequirement ? 'text-success' : 'text-danger'}>
                        {numberRequirement ? '✓ At least one number' : '✗ At least one number'}
                    </p>
                    <p className={specialCharRequirement ? 'text-success' : 'text-danger'}>
                        {specialCharRequirement ? '✓ At least one special character (e.g., !@#$%^&*)' : '✗ At least one special character (e.g., !@#$%^&*)'}
                    </p>

                    <Form.Check
                        type="switch"
                        id="activeSwitch"
                        label="Active Account"
                        checked={active}
                        onChange={(e) => setActive(e.target.checked)} // Toggle active status
                    />

                    <Button variant="primary" type="submit">
                        {editingStaffId ? 'Update Staff' : 'Add Staff'}
                    </Button>
                    <Button variant="secondary" className="ms-2" onClick={clearForm}>
                        Clear
                    </Button>
                </Form>
            </Col>
            

            <Col style={{ border: "1px solid violet", width: "auto"}} lg={4} md={12} sm={12} className='p-0'>
                <div className='p-3'>
                <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Username</th>
                                <th>Gender</th>
                                <th>Active</th> {/* Added Active Column */}
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {staffList.map((staff) => (
                                <tr key={staff.id}>
                                    <td>{staff.firstname}</td>
                                    <td>{staff.lastname}</td>
                                    <td>{staff.username}</td>
                                    <td>{staff.gender}</td>
                                    <td>{staff.active ? 'Yes' : 'No'}</td> {/* Display active status */}
                                    <td>
                                        <Button variant="warning" onClick={() => handleEditStaff(staff)}>Edit</Button>
                                        <Button variant="danger" className="ms-2" onClick={() => handleDeleteStaff(staff.id)}>Delete</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </Col>
        </Row>
    );
};

export default StaffComp;
