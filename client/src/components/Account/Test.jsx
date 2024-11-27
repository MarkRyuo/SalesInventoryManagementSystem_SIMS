import { Row, Form, Col, Button, InputGroup, DropdownButton, Dropdown } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useNavigate } from 'react-router-dom';
import bcrypt from 'bcryptjs';
import ProfileCompScss from './AccountComp.module.scss';

const ProfileComp = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        firstname: "",
        lastname: "",
        gender: "",
        username: "",
        password: "",
        phoneNumber: "", // Added phone number
        recoveryQuestions: [],
        answers: {}
    });
    const [isEditing, setIsEditing] = useState(false);
    const [showRecovery, setShowRecovery] = useState(false);
    const [answerVisibility, setAnswerVisibility] = useState({});
    const [otp, setOtp] = useState(""); // New state for OTP input
    const [otpSent, setOtpSent] = useState(false); // Track if OTP is sent
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

    const handleAnswerChange = (question, answer) => {
        setUserData((prevData) => ({
            ...prevData,
            answers: {
                ...prevData.answers,
                [question]: answer,
            },
        }));
        setAnswerVisibility((prevVisibility) => ({
            ...prevVisibility,
            [question]: false
        }));
    };

    const toggleAnswerVisibility = (question) => {
        setAnswerVisibility((prevVisibility) => ({
            ...prevVisibility,
            [question]: !prevVisibility[question]
        }));
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

            if (updatedPassword && updatedPassword !== '') {
                updatedPassword = await bcrypt.hash(updatedPassword, 10);
            }

            const updatedData = {
                ...userData,
                password: updatedPassword || userData.password
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
            setAnswerVisibility((prevVisibility) => ({
                ...prevVisibility,
                [question]: false
            }));
        }
    };

    // Send OTP request to backend
    const handleSendOtp = async () => {
        try {
            const response = await fetch('https://<your-firebase-functions-url>/sendOtp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phoneNumber: userData.phoneNumber }),
            });

            const result = await response.json();
            if (response.ok) {
                setOtpSent(true);
                alert('OTP sent!');
            } else {
                alert(result.error);
            }
        } catch (error) {
            console.error('Error sending OTP:', error);
        }
    };

    // Verify OTP request to backend
    const handleVerifyOtp = async () => {
        try {
            const response = await fetch('https://<your-firebase-functions-url>/verifyOtp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ otp, phoneNumber: userData.phoneNumber }),
            });

            const result = await response.json();
            if (response.ok) {
                alert('OTP verified successfully!');
            } else {
                alert(result.error);
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
        }
    };

    return (
        <Form className={ProfileCompScss.contentAccount}>
            <h1>My Details</h1>
            <h2>Personal Information</h2>
            <Row className={ProfileCompScss.RowContainer}>
                <Col lg={6}>
                    <Form.Group className="mb-3" controlId="firstname">
                        <Form.Label>First Name</Form.Label>
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
                        <Form.Label>Last Name</Form.Label>
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
            <Form.Group className="mb-3" controlId="phoneNumber" style={{ width: "100%", maxWidth: "500px", paddingLeft: 12 }}>
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                    type="text"
                    name="phoneNumber"
                    value={userData.phoneNumber}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                />
            </Form.Group>
            <Button
                variant="primary"
                onClick={handleSendOtp}
                disabled={otpSent || !isEditing}>
                Send OTP
            </Button>

            {otpSent && (
                <Form.Group className="mb-3" controlId="otp" style={{ width: "100%", maxWidth: "500px", paddingLeft: 12 }}>
                    <Form.Label>Enter OTP</Form.Label>
                    <Form.Control
                        type="text"
                        name="otp"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                    />
                </Form.Group>
            )}

            {otpSent && (
                <Button
                    variant="primary"
                    onClick={handleVerifyOtp}>
                    Verify OTP
                </Button>
            )}

            <InputGroup className="mb-3" style={{ width: "100%", maxWidth: "500px", paddingLeft: "12px" }}>
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

            {/* Rest of your form code */}

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
