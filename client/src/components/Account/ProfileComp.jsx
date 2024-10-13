import { Row, Form, Col, Button, InputGroup, DropdownButton, Dropdown } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useNavigate } from 'react-router-dom';

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
    const [showAnswers, setShowAnswers] = useState(false);
    const [questionAdded, setQuestionAdded] = useState(false); // Track if a question has been added
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
                    setQuestionAdded(data.recoveryQuestions.length > 0); // Check if recovery questions exist
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
            console.log("Updating user data:", userData);
            const adminDocRef = doc(db, 'admins', adminId);
            await updateDoc(adminDocRef, userData);
            alert("Profile updated successfully.");
            setIsEditing(false);
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
            setQuestionAdded(true); // Mark question as added
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
    };

    const toggleAnswersVisibility = () => {
        setShowAnswers((prev) => !prev);
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

            <h4>Select Recovery Questions</h4>
            <DropdownButton
                variant="outline-secondary"
                title="Choose a 3 Recovery Question"
                id="recovery-question-dropdown"
                onSelect={handleAddQuestion}
                disabled={!isEditing || questionAdded} // Disable if question has been added
            >
                {availableQuestions.map((question) => (
                    <Dropdown.Item key={question} eventKey={question}>
                        {question}
                    </Dropdown.Item>
                ))}
            </DropdownButton>

            {userData.recoveryQuestions.map((question) => (
                <Form.Group key={question} className="mb-3">
                    <Form.Label>Your Answer for: {question}</Form.Label>
                    <Form.Control
                        type={showAnswers ? "text" : "password"} // Toggle between text and password
                        value={userData.answers[question] || ''}
                        onChange={(e) => handleAnswerChange(question, e.target.value)}
                        disabled={!isEditing}
                    />
                </Form.Group>
            ))}

            <Button
                variant="link"
                onClick={toggleAnswersVisibility}
                style={{ textDecoration: "none" }}
            >
                {showAnswers ? "Hide Answers" : "Show Answers"}
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
