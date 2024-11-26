import { useEffect, useState } from 'react';
import { Button, Form, FloatingLabel, Table, Row, Col } from 'react-bootstrap';
import { db } from '../../services/firebase'; // Update path as needed
import { addDoc, collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import bcrypt from 'bcryptjs'; // Add this import
import StaffCompScss from './AccountComp.module.scss' ;
import { FaEdit } from "react-icons/fa";
import { FaRegTrashAlt } from "react-icons/fa";


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
    const [isPasswordFocused, setIsPasswordFocused] = useState(false); // Track password field focus

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

            // Hash the password before saving it
            const hashedPassword = await bcrypt.hash(password, 10);

            // If editing, update the staff, otherwise add a new one
            if (editingStaffId) {
                const staffDoc = doc(db, 'staffs', editingStaffId);
                await updateDoc(staffDoc, {
                    firstname,
                    lastname,
                    gender,
                    username,
                    password: hashedPassword, // Store the hashed password
                    active, // Update active status
                });
                alert('Staff member updated successfully!');
            } else {
                await addDoc(staffCollection, {
                    firstname,
                    lastname,
                    gender,
                    username,
                    password: hashedPassword, // Store the hashed password
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
        setPassword(''); // Ensure this is cleared
        setActive(true);
        setEditingStaffId(null);
        setErrorMessage('');

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
        setActive(staff.active);
        setEditingStaffId(staff.id);
        setErrorMessage('');

        // Validate the existing password
        validatePassword(staff.password); // Validate the password when editing
    };

    const handleDeleteStaff = async (staffId) => {
        if (window.confirm('Are you sure you want to delete this staff member?')) {
            try {
                const staffDoc = doc(db, 'staffs', staffId);
                await deleteDoc(staffDoc);
                alert('Staff member deleted successfully!');
                fetchStaff();
            } catch (error) {
                console.error('Error deleting staff:', error);
                alert('Error deleting staff. Please try again.');
            }
        }
    };

    const handleToggleActive = async (staff) => {
        try {
            const staffDoc = doc(db, 'staffs', staff.id);
            await updateDoc(staffDoc, { active: !staff.active }); // Toggle the active status
            fetchStaff(); // Refresh the staff list after updating
        } catch (error) {
            console.error('Error updating staff active status:', error);
            alert('Error updating status. Please try again.');
        }
    };

    useEffect(() => {
        fetchStaff(); // Fetch staff on component mount
    }, []);

    return (
        <Row style={{ display: 'flex', width: "100%", margin: 0, justifyContent: "space-between" }}>
            <Col className='p-0' lg={5} md={12} sm={12}>
                <p className='m-0 p-0 ps-3 fw-light'><span className='fw-semibold'>Reminder: </span>Please ensure that all staff details are accurately filled before saving.</p>
                <Form onSubmit={handleAddStaff} style={{ padding: "20px", width: '100%' }}>
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
                        <Form.Select
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                        >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Rather not say">Rather not say</option>
                        </Form.Select>
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
                            onFocus={() => setIsPasswordFocused(true)} // Set focus state to true
                            onBlur={() => setIsPasswordFocused(false)} // Set focus state to false
                            onChange={(e) => {
                                setPassword(e.target.value);
                                validatePassword(e.target.value); // Validate on change
                            }}
                        />
                    </FloatingLabel>

                    {errorMessage && <p className="text-danger">{errorMessage}</p>}

                    {isPasswordFocused && ( // Show requirements only if focused
                        <>
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
                        </>
                    )}

                    <Form.Check
                        type="switch"
                        id="activeSwitch"
                        label="Active Account"
                        checked={active}
                        onChange={(e) => setActive(e.target.checked)}
                    />

                    <Button variant="primary" type="submit" className='mt-3'>
                        {editingStaffId ? 'Update Staff' : 'Add Staff'}
                    </Button>
                    <Button variant="secondary" className="ms-2 mt-3" onClick={clearForm}>
                        Clear
                    </Button>
                </Form>
            </Col>

            <Col lg={4} md={12} sm={12} className={StaffCompScss.ColStaffComp}>
                <h1>Staff list Preview</h1>
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Gender</th>
                            <th>Username</th>
                            <th>Active</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {staffList.map(staff => (
                            <tr key={staff.id}>
                                <td>{staff.firstname}</td>
                                <td>{staff.lastname}</td>
                                <td>{staff.gender}</td>
                                <td>{staff.username}</td>
                                <td>
                                    <Form.Check
                                        type="switch"
                                        checked={staff.active}
                                        onChange={() => handleToggleActive(staff)}
                                    />
                                </td>
                                <td style={{border: '1px solid', display: 'flex', flexDirection: 'column', gap: '10px'}}>
                                    <Button variant="warning"  onClick={() => handleEditStaff(staff)}><FaEdit /></Button>
                                    <Button variant="outline-danger" onClick={() => handleDeleteStaff(staff.id)}><FaRegTrashAlt /></Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Col>
        </Row>
    );
};

export default StaffComp;
