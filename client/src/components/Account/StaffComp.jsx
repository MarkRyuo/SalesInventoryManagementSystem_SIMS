import { useEffect, useState } from 'react';
import { Button, Form, FloatingLabel, Table } from 'react-bootstrap';
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

    const handleAddStaff = async (e) => {
        e.preventDefault(); // Prevent default form submission
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

            <h2 className="mt-4">Active Staff Accounts</h2>
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
                                <Button variant="warning" onClick={() => handleEditStaff(staff)}>
                                    Edit
                                </Button>
                                <Button variant="danger" onClick={() => handleDeleteStaff(staff.id)} className="ms-2">
                                    Delete
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default StaffComp;
