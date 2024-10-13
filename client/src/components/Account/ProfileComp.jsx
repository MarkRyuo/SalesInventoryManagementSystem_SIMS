import { Row, Form, Col, Button, InputGroup, DropdownButton, Dropdown } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { FcGoogle } from "react-icons/fc";
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const ProfileComp = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        firstname: "",
        lastname: "",
        gender: "",
        username: "",
        password: "",
        email: ""
    });
    const [isEditing, setIsEditing] = useState(false);
    const [selectedQuestions, setSelectedQuestions] = useState([]); // New state for selected questions
    const [answers, setAnswers] = useState(['', '', '']); // State for answers corresponding to selected questions
    const adminId = localStorage.getItem('adminId');

    // Array of questions
    const questions = [
        "What is your pet's name?",
        "What was the name of your first school?",
        "What is your favorite color?",
        "What is your mother's maiden name?",
        "What city were you born in?",
        "What is the name of your childhood best friend?",
        "What was your first job?",
        "What is your favorite book?"
    ];

    // Function to handle gender selection
    const handleGenderSelect = (eventKey) => {
        setUserData({ ...userData, gender: eventKey });
    };

    // Function to handle question selection
    const handleQuestionSelect = (question) => {
        if (selectedQuestions.length < 3 && !selectedQuestions.includes(question)) {
            setSelectedQuestions([...selectedQuestions, question]);
        }
    };

    // Function to handle answer input changes
    const handleAnswerChange = (index, value) => {
        const updatedAnswers = [...answers];
        updatedAnswers[index] = value;
        setAnswers(updatedAnswers);
    };

    // Function to handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
    };

    // Function to fetch user data
    useEffect(() => {
        const fetchUserData = async () => {
            if (!adminId) {
                alert("No user ID found. Please log in.");
                navigate("/");
                return;
            }

            try {
                const adminDocRef = doc(db, 'admins', adminId);
                const adminDoc = await getDoc(adminDocRef);

                if (adminDoc.exists()) {
                    setUserData(adminDoc.data());
                    console.log("Fetched user data:", adminDoc.data());
                } else {
                    alert("User data not found.");
                    navigate("/login");
                }
            } catch (error) {
                console.error("Error fetching user data:", error.message);
                alert("Failed to fetch user data.");
            }
        };

        fetchUserData();
    }, [adminId, navigate]);

    // Function to save updated user data
    const handleSave = async () => {
        try {
            console.log("Updating user data:", userData);
            const adminDocRef = doc(db, 'admins', adminId);
            await updateDoc(adminDocRef, {
                ...userData,
                securityQuestions: selectedQuestions,
                answers: answers
            });
            alert("Profile updated successfully.");
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating profile:", error);
            alert(`Failed to update profile: ${error.message}`);
        }
    };

    // Function to handle Google Sign-In
    const handleGoogleSignIn = async () => {
        const provider = new GoogleAuthProvider();

        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            const adminDocRef = doc(db, 'admins', adminId);

            const adminDoc = await getDoc(adminDocRef);
            if (adminDoc.exists()) {
                await updateDoc(adminDocRef, {
                    email: user.email,
                });
                alert("Profile connected to Google account.");
            } else {
                alert("Admin not found. Please log in first.");
                navigate("/login");
                return;
            }

            console.log("Google Sign-In successful:", user);
            setUserData({
                ...userData,
                email: user.email,
            });

        } catch (error) {
            console.error("Error during Google Sign-In:", error);
            alert(`Failed to connect to Google: ${error.message}`);
        }
    };

    return (
        <Form>
            <Row style={{ width: "100%", margin: 0, padding: 0 }}>
                <Col lg={6}>
                    <Form.Group className="mb-3" controlId="firstname">
                        <Form.Label>FIRST NAME</Form.Label>
                        <Form.Control
                            type="text"
                            name="firstname"
                            value={userData.firstname}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                        />
                    </Form.Group>
                </Col>
                <Col lg={6}>
                    <Form.Group className="mb-3" controlId="lastname">
                        <Form.Label>LAST NAME</Form.Label>
                        <Form.Control
                            type="text"
                            name="lastname"
                            value={userData.lastname}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                        />
                    </Form.Group>
                </Col>
            </Row>
            <InputGroup className="mb-3" style={{ width: "100%", maxWidth: "500px", paddingLeft: "11px" }}>
                <Form.Control
                    aria-label="Text input with dropdown button"
                    placeholder={userData.gender || 'Select Gender'}
                    readOnly
                    value={userData.gender}
                    disabled={!isEditing}
                />
                <DropdownButton
                    variant="outline-secondary"
                    title="Gender"
                    id="input-group-dropdown-1"
                    align="end"
                    onSelect={handleGenderSelect}
                    disabled={!isEditing}
                >
                    <Dropdown.Item eventKey="Male">Male</Dropdown.Item>
                    <Dropdown.Item eventKey="Female">Female</Dropdown.Item>
                </DropdownButton>
            </InputGroup>

            {/* New Dropdown for Questions */}
            <Form.Group className="mb-3" controlId="securityQuestions" style={{ width: "100%", maxWidth: "500px", paddingLeft: 10 }}>
                <Form.Label>Select Security Questions</Form.Label>
                <DropdownButton
                    variant="outline-secondary"
                    title="Choose a question"
                    id="question-dropdown"
                    disabled={!isEditing}
                >
                    {questions.map((question, index) => (
                        <Dropdown.Item key={index} onClick={() => handleQuestionSelect(question)}>{question}</Dropdown.Item>
                    ))}
                </DropdownButton>
            </Form.Group>

            {/* Render selected questions and answer inputs */}
            {selectedQuestions.map((question, index) => (
                <Form.Group key={index} className="mb-3" controlId={`answer${index}`} style={{ width: "100%", maxWidth: "500px", paddingLeft: 10 }}>
                    <Form.Label>{question}</Form.Label>
                    <Form.Control
                        type="text"
                        value={answers[index]}
                        onChange={(e) => handleAnswerChange(index, e.target.value)}
                        disabled={!isEditing}
                    />
                </Form.Group>
            ))}

            <Form.Group className="mb-3" controlId="username" style={{ width: "100%", maxWidth: "500px", paddingLeft: 10 }}>
                <Form.Label>Username</Form.Label>
                <Form.Control
                    type="text"
                    name="username"
                    value={userData.username}
                    onChange={handleInputChange}
                    disabled
                />
            </Form.Group>

            <Form.Group className="mb-3" controlId="password" style={{ width: "100%", maxWidth: "500px", paddingLeft: 10 }}>
                <Form.Label>Password</Form.Label>
                <Form.Control
                    type="password"
                    name="password"
                    value={userData.password}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                />
            </Form.Group>

            <Form.Group className="mb-3" controlId="email" style={{ width: "100%", maxWidth: "500px", paddingLeft: 10 }}>
                <Form.Label>Email address</Form.Label>
                <Form.Control
                    type="email"
                    name="email"
                    value={userData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                />
            </Form.Group>

            <Button variant="light" size='sm' className='ms-2' onClick={handleGoogleSignIn}>
                <FcGoogle size={35} className='me-2' />
                Connect to Google
            </Button>

            <div className='mt-3'>
                <Button
                    variant='primary'
                    className='ms-2'
                    onClick={() => setIsEditing(true)}
                    disabled={isEditing}>
                    Edit
                </Button>
                <Button
                    variant='primary'
                    className='ms-2'
                    onClick={handleSave}
                    disabled={!isEditing}>
                    Save
                </Button>
            </div>
        </Form>
    );
};

export default ProfileComp;
