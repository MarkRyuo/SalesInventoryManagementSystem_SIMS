import { useEffect, useState } from 'react';
import { Button, Form, FloatingLabel} from 'react-bootstrap';
import { db } from '../../services/firebase'; // Update path as needed
import { addDoc, collection, deleteDoc, doc, updateDoc, onSnapshot } from 'firebase/firestore';
import bcrypt from 'bcryptjs'; // Add this import
import StaffCompScss from './AccountComp.module.scss';
import { FaEdit } from "react-icons/fa";
import { FaRegTrashAlt } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";


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
    const [isPasswordVisible, setIsPasswordVisible] = useState(false); // State for toggling visibility


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

    const fetchStaff = () => {
        // Listen for real-time updates from Firestore
        const staffCollection = collection(db, 'staffs');
        onSnapshot(staffCollection, (snapshot) => {
            const staffData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setStaffList(staffData); // Update staff list in state
        }, (error) => {
            console.error('Error fetching staff:', error);
        });
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
        } catch (error) {
            console.error('Error updating staff active status:', error);
            alert('Error updating status. Please try again.');
        }
    };

    useEffect(() => {
        fetchStaff(); // Fetch staff on component mount and listen for changes
    }, []);

    return (
        <div className={StaffCompScss.mainContainer}>
            <div className={StaffCompScss.contentStaff}>
                <p><span className='fw-semibold'>Reminder: </span>Please ensure that all staff details are accurately filled before saving.</p>
                <Form onSubmit={handleAddStaff} >
                    <FloatingLabel controlId="floatingFirstname" label="First Name">
                        <Form.Control
                            type="text"
                            placeholder="First Name"
                            value={firstname}
                            onChange={(e) => setFirstname(e.target.value)}
                            className={StaffCompScss.staffFirstName}
                        />
                    </FloatingLabel>

                    <FloatingLabel controlId="floatingLastname" label="Last Name">
                        <Form.Control
                            type="text"
                            placeholder="Last Name"
                            value={lastname}
                            onChange={(e) => setLastname(e.target.value)}
                            className={StaffCompScss.staffLastName}
                        />
                    </FloatingLabel>

                    <FloatingLabel controlId="floatingGender" label="Gender">
                        <Form.Select
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            className={StaffCompScss.staffGender}
                        >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Rather not say">Rather not say</option>
                        </Form.Select>
                    </FloatingLabel>

                    <FloatingLabel controlId="floatingUsername" label="Username">
                        <Form.Control
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className={StaffCompScss.staffUsername}
                        />
                    </FloatingLabel>

                    <FloatingLabel controlId="floatingPassword" label="Password">
                            <Form.Control
                                type={isPasswordVisible ? 'text' : 'password'}
                                placeholder="Password"
                                value={password}
                                onFocus={() => setIsPasswordFocused(true)}
                                onBlur={() => setIsPasswordFocused(false)}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    validatePassword(e.target.value);
                                }}
                                className={`${StaffCompScss.staffPassword} d-flex align-items-center position-relative`}
                            />
                            <Button
                                variant="light"
                                className="position-absolute end-0 top-50 translate-middle-y me-2 border-0"
                                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                                style={{ boxShadow: 'none' }}
                            >
                            {isPasswordVisible ? <FaEye size={20}/> : <FaEyeSlash size={20}/>}
                            </Button>
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
                                {specialCharRequirement ? '✓ At least one special character' : '✗ At least one special character'}
                            </p>
                        </>
                    )}

                    <div className="d-flex gap-3 my-3">
                        <Button
                            variant={editingStaffId ? 'warning' : 'primary'}
                            type="submit"
                            style={{ width: 100 }}
                        >
                            {editingStaffId ? 'Update Staff' : 'Add'}
                        </Button>
                        <Button variant="" onClick={clearForm} style={{ border: '1px solid' }}>Clear</Button>
                    </div>
                </Form>
            </div>

            <div className={StaffCompScss.StaffList}>
                <h4>Staff List</h4>
                <div className={`${StaffCompScss.scrollableList} overflow-auto`} style={{ maxHeight: '50vh' }}>
                    {staffList.length === 0 && <p>No staff members found</p>}
                    {staffList.map((staff) => (
                        <div key={staff.id} className={StaffCompScss.Detailss}>
                            <div className={StaffCompScss.textx}>
                                <p className="m-0"><strong>{staff.firstname} {staff.lastname}</strong></p>
                                <p className="m-0">{staff.username}</p>
                                <p className="m-0">{staff.active ? 'Active' : 'Inactive'}</p>
                            </div>

                            <div className={StaffCompScss.DetailsBtn}>
                                <Button
                                    variant="info"
                                    onClick={() => handleEditStaff(staff)}
                                >
                                    <FaEdit />
                                </Button>

                                <Button
                                    variant={staff.active ? 'danger' : 'success'}
                                    onClick={() => handleToggleActive(staff)}
                                >
                                    {staff.active ? 'Deactivate' : 'Activate'}
                                </Button>

                                <Button
                                    variant="danger"
                                    onClick={() => handleDeleteStaff(staff.id)}
                                >
                                    <FaRegTrashAlt />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StaffComp;
