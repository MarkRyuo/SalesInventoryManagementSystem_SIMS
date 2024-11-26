import { Row, Form, Col, Button, InputGroup, DropdownButton, Dropdown } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useNavigate } from 'react-router-dom';
import bcrypt from 'bcryptjs';  // Import bcryptjs for password hashing
import ProfileCompScss from './AccountComp.module.scss' ;

const ProfileComp = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        firstname: "",
        lastname: "",
        gender: "",
        username: "",
        password: "",
        recoveryQuestions: [],
        answers: {}
    });
    const [isEditing, setIsEditing] = useState(false);
    const [showRecovery, setShowRecovery] = useState(false);
    const [answerVisibility, setAnswerVisibility] = useState({}); // State for individual answer visibility
    const adminId = localStorage.getItem('adminId');

    const availableQuestions = [
        "In which city was your first business located?",
        "What year did you start your business?",
        "What is the name of your first school?",
        "What is your favorite color?",
        "What city were you born in?"
    ];

    const handleGenderSelect = (eventKey) => {
        setUserData({ ...userData, gender: eventKey });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
    };

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
                    const data = adminDoc.data();
                    setUserData({
                        ...data,
                        recoveryQuestions: data.recoveryQuestions || [],
                        answers: data.answers || {}
                    });
                    console.log("Fetched user data:", data);
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

    const handleSave = async () => {
        try {
            let updatedPassword = userData.password;

            // Hash the password if it's changed
            if (updatedPassword && updatedPassword !== '') {
                updatedPassword = await bcrypt.hash(updatedPassword, 10);  // Hash with salt rounds
            }

            // Prepare the updated data with the hashed password (if changed)
            const updatedData = {
                ...userData,
                password: updatedPassword || userData.password  // Use hashed password or original
            };

            const adminDocRef = doc(db, 'admins', adminId);
            await updateDoc(adminDocRef, updatedData);

            alert("Profile updated successfully.");
            setIsEditing(false);
            setShowRecovery(false);
            setAnswerVisibility({});
        } catch (error) {
            console.error("Error updating profile:", error);
            alert(`Failed to update profile: ${error.message}`);
        }
    };



    const handleAddQuestion = (question) => {
        if (!userData.recoveryQuestions.includes(question) && userData.recoveryQuestions.length < 3) {
            setUserData((prevData) => ({
                ...prevData,
                recoveryQuestions: [...prevData.recoveryQuestions, question],
            }));
            // Initialize visibility state for the new question
            setAnswerVisibility((prevVisibility) => ({
                ...prevVisibility,
                [question]: false // Initially set to false (hidden)
            }));
        }
    };

    const handleAnswerChange = (question, answer) => {
        setUserData((prevData) => ({
            ...prevData,
            answers: {
                ...prevData.answers,
                [question]: answer,
            },
        }));
        // Hide the answer input field after the answer is filled
        setAnswerVisibility((prevVisibility) => ({
            ...prevVisibility,
            [question]: false
        }));
    };

    const toggleAnswerVisibility = (question) => {
        setAnswerVisibility((prevVisibility) => ({
            ...prevVisibility,
            [question]: !prevVisibility[question] // Toggle visibility for this specific question
        }));
    };

    return (
        <Form className={ProfileCompScss.contentAccount}>
            <h1>My Details</h1>
            <h2 style={{ borderBottom: "1px solid gray", padding: "20px 10px", fontSize: '1.5rem' }}>Personal Information</h2>
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
                    title="Dropdown"
                    id="input-group-dropdown-2"
                    align="end"
                    onSelect={handleGenderSelect}
                    disabled={!isEditing}
                >
                    <Dropdown.Item eventKey="Male">Male</Dropdown.Item>
                    <Dropdown.Item eventKey="Female">Female</Dropdown.Item>
                </DropdownButton>
            </InputGroup>

            <Form.Group className="mb-3" controlId="username" style={{ width: "100%", maxWidth: "500px", paddingLeft: 10 }}>
                <Form.Label>Username</Form.Label>
                <Form.Control
                    type="text"
                    name="username"
                    value={userData.username}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                />
            </Form.Group>

            <Form.Group className="mb-3" controlId="password" style={{ width: "100%", maxWidth: "500px", paddingLeft: 10 }}>
                <Form.Label>Password</Form.Label>
                <Form.Control
                    type="password"
                    name="password"
                    value={userData.password}
                    onChange={handleInputChange}
                    disabled={!isEditing}  // Make password editable only when in edit mode
                />
            </Form.Group>

            {isEditing && (
                <div>
                    <Button
                        variant="link"
                        onClick={() => setShowRecovery(!showRecovery)}
                        style={{ padding: 0 }}
                    >
                        {showRecovery ? "Hide Recovery Questions" : "Show Recovery Questions"}
                    </Button>

                    {showRecovery && (
                        <>
                            <h4>Select Recovery Questions</h4>
                            <DropdownButton
                                variant="outline-secondary"
                                title="Choose a Recovery Question"
                                id="recovery-question-dropdown"
                                onSelect={handleAddQuestion}
                                disabled={userData.recoveryQuestions.length >= 3}
                            >
                                {availableQuestions.map((question) => (
                                    <Dropdown.Item key={question} eventKey={question}>
                                        {question}
                                    </Dropdown.Item>
                                ))}
                            </DropdownButton>

                            {userData.recoveryQuestions.map((question) => (
                                <Form.Group key={question} className="mb-3" style={{ position: "relative" }}>
                                    <Form.Label>Your Answer for: {question}</Form.Label>
                                    <Form.Control
                                        type={answerVisibility[question] ? "text" : "password"} // Toggle individual answer visibility
                                        value={userData.answers[question] || ''}
                                        onChange={(e) => handleAnswerChange(question, e.target.value)}
                                        readOnly={!isEditing} // Make answers read-only when not editing
                                    />
                                    <Button
                                        variant="link"
                                        onClick={() => toggleAnswerVisibility(question)} // Toggle answer visibility for this specific question
                                        style={{ padding: 0 }}
                                    >
                                        {answerVisibility[question] ? "Hide Answer" : "Show Answer"}
                                    </Button>
                                </Form.Group>
                            ))}
                        </>
                    )}
                </div>
            )}

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
