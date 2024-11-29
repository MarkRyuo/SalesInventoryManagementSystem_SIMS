import { Form, Button, InputGroup, DropdownButton, Dropdown } from 'react-bootstrap';
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
        email: "", // Replace phoneNumber with email
        recoveryQuestions: [],
        answers: {}
    });
    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);

    const [isEditing, setIsEditing] = useState(false);
    const [showRecovery, setShowRecovery] = useState(false);
    const [answerVisibility, setAnswerVisibility] = useState({});
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
        if (!userData.email) {
            alert('Please enter a valid email address');
            return;
        }

        try {
            const response = await fetch('https://api-hqnwrfpmoa-uc.a.run.app/generate-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: userData.email }),
            });

            const result = await response.json();
            if (response.ok) {
                setOtpSent(true);
                alert('OTP sent to your email!');
            } else {
                alert(result.error);
            }
        } catch (error) {
            console.error('Error sending OTP:', error);
        }
    };


    const handleVerifyOtp = async () => {
        try {
            const response = await fetch('https://api-hqnwrfpmoa-uc.a.run.app/validate-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: userData.email, otp }),
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
            <div className={ProfileCompScss.RowContainer}>
                <Form.Group controlId="firstname">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                        type="text"
                        name="firstname"
                        value={userData.firstname}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={ProfileCompScss.FirstName}
                    />
                </Form.Group>

                <Form.Group controlId="lastname">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                        type="text"
                        name="lastname"
                        value={userData.lastname}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={ProfileCompScss.LastName}
                    />
                </Form.Group>
            </div>


            <Form.Group controlId="username">
                <Form.Label>Username</Form.Label>
                <Form.Control
                    type="text"
                    name="username"
                    value={userData.username}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={ProfileCompScss.UserName}
                />
            </Form.Group>

            <InputGroup className={ProfileCompScss.Gender}>
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

            <div className={ProfileCompScss.OTPcontainer}>
                <Form.Group className="email" controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        name="email"
                        value={userData.email}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={ProfileCompScss.Email}
                    />
                </Form.Group>


                <Button
                    variant=""
                    onClick={handleSendOtp}
                    disabled={otpSent || !isEditing}>
                    Send OTP
                </Button>
            </div>

            <Form.Group className="password" controlId="password">
                <Form.Label className='ms-2'>Password</Form.Label>
                <Form.Control
                    type="password"
                    name="password"
                    value={userData.password}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={ProfileCompScss.Password}
                />
            </Form.Group>

            {otpSent && (
                <>
                    <Form.Group className="mb-3" controlId="otp" style={{ width: "100%", maxWidth: "500px", paddingLeft: 12 }}>
                        <Form.Label>Enter OTP</Form.Label>
                        <Form.Control
                            type="text"
                            name="otp"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                        />
                    </Form.Group>
                    <Button
                        variant="primary"
                        onClick={handleVerifyOtp}
                        disabled={!otp}>
                        Verify OTP
                    </Button>
                </>
            )}

            {isEditing && (
                <>
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
                                        type={answerVisibility[question] ? "text" : "password"}
                                        value={userData.answers[question] || ''}
                                        onChange={(e) => handleAnswerChange(question, e.target.value)}
                                        readOnly={!isEditing}
                                    />
                                    <Button
                                        variant="link"
                                        onClick={() => toggleAnswerVisibility(question)}
                                        style={{ padding: 0 }}
                                    >
                                        {answerVisibility[question] ? "Hide Answer" : "Show Answer"}
                                    </Button>
                                </Form.Group>
                            ))}
                        </>
                    )}
                </>
            )}

            <div className={ProfileCompScss.buttonss}>
                <Button
                    variant='info'
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
