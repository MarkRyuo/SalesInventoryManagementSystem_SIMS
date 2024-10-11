import { Row, Form, Col, Button, InputGroup, DropdownButton, Dropdown, Toast } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { FcGoogle } from "react-icons/fc";
import { db } from '../../firebase'; // Import Realtime Database
import { ref, onValue, update } from 'firebase/database'; // For querying and updating accounts
import { getAuth, updateEmail, updatePassword } from "firebase/auth"; // Import Auth functions

const ProfileComp = () => {
    // State variables
    const [gender, setGender] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [accounts, setAccounts] = useState([]); // To hold the list of accounts
    const [selectedAccount, setSelectedAccount] = useState(null); // To hold the selected account
    const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
    const [showNotification, setShowNotification] = useState(false); // State to control notification visibility

    // Function to handle gender selection
    const handleGenderSelect = (eventKey) => {
        setGender(eventKey); // Update the gender state with the selected value
    };

    useEffect(() => {
        // Fetch accounts from the Realtime Database
        const accountsRef = ref(db, 'staff/'); // Adjust the path based on your structure
        onValue(accountsRef, (snapshot) => {
            const data = snapshot.val();
            const loadedAccounts = [];
            for (let id in data) {
                loadedAccounts.push({ id, ...data[id] });
            }
            setAccounts(loadedAccounts); // Set the loaded accounts in state
        });
    }, []);

    const handleAccountSelect = (account) => {
        // Populate the fields with the selected account information
        setSelectedAccount(account);
        setFirstName(account.firstName);
        setLastName(account.lastName);
        setUsername(account.username);
        setEmail(account.email);
        setPassword(account.password); // Set the password
        setGender(account.gender);
    };

    const handleEdit = () => {
        // Check if an account is selected
        if (selectedAccount) {
            const accountRef = ref(db, `staff/${selectedAccount.id}`);
            
            // Update the account details in the Realtime Database
            update(accountRef, {
                firstName,
                lastName,
                username,
                email, // Only update the email if it has changed
                gender,
            }).then(() => {
                // Update Firebase Authentication if email is changed
                const auth = getAuth();
                const user = auth.currentUser;

                if (user) {
                    // Check if the email has changed before updating
                    if (user.email !== email) {
                        updateEmail(user, email).then(() => {
                            // Email updated successfully
                            console.log("Email updated successfully!");
                        }).catch((error) => {
                            console.error("Error updating email: ", error);
                            // Optionally, handle error notifications here
                        });
                    }

                    // Check if the password has changed before updating
                    if (password) { // Update only if there's a new password
                        updatePassword(user, password).then(() => {
                            console.log("Password updated successfully!");
                        }).catch((error) => {
                            console.error("Error updating password: ", error);
                            // Optionally, handle error notifications here
                        });
                    }
                }

                // Show notification on successful save
                setShowNotification(true);
            }).catch((error) => {
                console.error("Error updating account: ", error);
                // Optionally, you can show an error notification here
            });
        }
    };

    return (
        <>
            <Form>
                <Row style={{ width: "100%", margin: 0, padding: 0 }}>
                    <Col lg={6}>
                        <Form.Group className="mb-3" controlId="firstName">
                            <Form.Label>FIRST NAME</Form.Label>
                            <Form.Control
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)} // Handle input change
                            />
                        </Form.Group>
                    </Col>
                    <Col lg={6}>
                        <Form.Group className="mb-3" controlId="lastName">
                            <Form.Label>LAST NAME</Form.Label>
                            <Form.Control
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)} // Handle input change
                            />
                        </Form.Group>
                    </Col>
                </Row>

                {/* DropDown for Gender Selection */}
                <InputGroup className="mb-3" style={{ width: "100%", maxWidth: "500px", paddingLeft: "11px" }}>
                    <Form.Control
                        aria-label="Text input with dropdown button"
                        placeholder={gender || 'Select Gender'}
                        readOnly
                    />
                    <DropdownButton
                        variant="outline-secondary"
                        title="Dropdown"
                        id="input-group-dropdown-2"
                        align="end"
                        onSelect={handleGenderSelect}
                    >
                        <Dropdown.Item eventKey="Male">Male</Dropdown.Item>
                        <Dropdown.Item eventKey="Female">Female</Dropdown.Item>
                    </DropdownButton>
                </InputGroup>

                {/* Username Input */}
                <Form.Group
                    className="mb-3"
                    controlId="username"
                    style={{ width: "100%", maxWidth: "500px", paddingLeft: 10 }} >
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)} // Handle input change
                    />
                </Form.Group>

                {/* Password Input */}
                <Form.Group
                    className="mb-3"
                    controlId="password"
                    style={{ width: "100%", maxWidth: "500px", paddingLeft: 10 }}>
                    <Form.Label>Password</Form.Label>
                    <InputGroup>
                        <Form.Control
                            type={showPassword ? "text" : "password"} // Toggle between text and password
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} // Handle input change
                        />
                        <Button variant="outline-secondary" onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? 'Hide' : 'Show'} {/* Toggle button text */}
                        </Button>
                    </InputGroup>
                </Form.Group>

                {/* Email Input */}
                <Form.Group
                    className="mb-3"
                    controlId="email"
                    style={{ width: "100%", maxWidth: "500px", paddingLeft: 10 }} >
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} // Handle input change
                    />
                </Form.Group>

                {/* Account Selection Dropdown */}
                <InputGroup className="mb-3" style={{ width: "100%", maxWidth: "500px", paddingLeft: "11px" }}>
                    <Form.Control
                        aria-label="Text input with dropdown button"
                        placeholder="Select Account"
                        readOnly
                    />
                    <DropdownButton
                        variant="outline-secondary"
                        title="Accounts"
                        id="input-group-dropdown-accounts"
                        align="end"
                    >
                        {accounts.map(account => (
                            <Dropdown.Item key={account.id} onClick={() => handleAccountSelect(account)}>
                                {account.username}
                            </Dropdown.Item>
                        ))}
                    </DropdownButton>
                </InputGroup>

                {/* Button Connect to Google */}
                <Button variant="light" size='sm' className='ms-2'>
                    <FcGoogle size={35} className='me-2' />
                    Connect to Google
                </Button>

                {/* Container of button(Save, Edit) */}
                <div className='mt-3'>
                    <Button variant='primary' className='ms-2' onClick={handleEdit}>Save</Button>
                    <Button variant='primary' className='ms-2'>Edit</Button>
                </div>
            </Form>

            {/* Notification Toast */}
            <Toast
                onClose={() => setShowNotification(false)}
                show={showNotification}
                delay={3000}
                autohide
                style={{ position: 'absolute', top: '20px', right: '20px' }} >
                <Toast.Body>Account updated successfully!</Toast.Body>
            </Toast>
        </>
    );
}

export default ProfileComp;
