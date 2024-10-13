import { useState, useEffect } from 'react';
import { Button, Form, FloatingLabel, Card } from 'react-bootstrap';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';

const ProfileComp = ({ adminId }) => {
    const [userData, setUserData] = useState({
        firstname: '',
        lastname: '',
        gender: '',
        username: '',
        password: '',
        selectedQuestions: [],
        answers: {}
    });
    const [availableQuestions] = useState([
        "In which city was your first business located?",
        "What year did you start your business?",
        "What is the name of your first school?",
        "What is your favorite color?",
        "What city were you born in?"
    ]);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const docRef = doc(db, 'admins', adminId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setUserData({
                        firstname: data.firstname || '',
                        lastname: data.lastname || '',
                        gender: data.gender || '',
                        username: data.username || '',
                        password: data.password || '',
                        selectedQuestions: data.selectedQuestions || [],
                        answers: data.answers || {}
                    });
                } else {
                    console.error('Admin profile not found.');
                }
            } catch (error) {
                console.error('Error fetching profile data:', error.message);
            }
        };

        fetchProfileData();
    }, [adminId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleQuestionChange = (question, answer) => {
        setUserData((prevData) => ({
            ...prevData,
            answers: {
                ...prevData.answers,
                [question]: answer,
            },
        }));
    };

    const handleQuestionSelection = (question) => {
        setUserData((prevData) => {
            const { selectedQuestions } = prevData;
            if (selectedQuestions.includes(question)) {
                return {
                    ...prevData,
                    selectedQuestions: selectedQuestions.filter((q) => q !== question),
                };
            } else if (selectedQuestions.length < 3) {
                return {
                    ...prevData,
                    selectedQuestions: [...selectedQuestions, question],
                };
            }
            return prevData;
        });
    };

    const handleSubmit = async () => {
        const { firstname, lastname, gender, username, password, selectedQuestions, answers } = userData;

        if (selectedQuestions.length !== 3) {
            alert('Please select exactly 3 recovery questions.');
            return;
        }

        try {
            const docRef = doc(db, 'admins', adminId);
            await updateDoc(docRef, {
                firstname,
                lastname,
                gender,
                username,
                password,
                selectedQuestions,
                answers
            });

            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error.message);
            alert('An error occurred while updating your profile. Please try again.');
        }
    };

    return (
        <Card style={{ padding: '20px', margin: '20px' }}>
            <h2>Profile Information</h2>
            <Form>
                <FloatingLabel controlId="floatingFirstname" label="First Name" className="mb-3">
                    <Form.Control
                        type="text"
                        placeholder="First Name"
                        name="firstname"
                        value={userData.firstname}
                        onChange={handleInputChange}
                    />
                </FloatingLabel>

                <FloatingLabel controlId="floatingLastname" label="Last Name" className="mb-3">
                    <Form.Control
                        type="text"
                        placeholder="Last Name"
                        name="lastname"
                        value={userData.lastname}
                        onChange={handleInputChange}
                    />
                </FloatingLabel>

                <FloatingLabel controlId="floatingGender" label="Gender" className="mb-3">
                    <Form.Select
                        name="gender"
                        value={userData.gender}
                        onChange={handleInputChange}
                    >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </Form.Select>
                </FloatingLabel>

                <FloatingLabel controlId="floatingUsername" label="Username" className="mb-3">
                    <Form.Control
                        type="text"
                        placeholder="Username"
                        name="username"
                        value={userData.username}
                        onChange={handleInputChange}
                        disabled
                    />
                </FloatingLabel>

                <FloatingLabel controlId="floatingPassword" label="Password" className="mb-3">
                    <Form.Control
                        type="password"
                        placeholder="Password"
                        name="password"
                        value={userData.password}
                        onChange={handleInputChange}
                    />
                </FloatingLabel>

                <h4>Select 3 Recovery Questions</h4>
                {availableQuestions.map((question) => (
                    <div key={question} className="mb-3">
                        <Form.Check
                            type="checkbox"
                            label={question}
                            checked={userData.selectedQuestions.includes(question)}
                            onChange={() => handleQuestionSelection(question)}
                        />
                        {userData.selectedQuestions.includes(question) && (
                            <FloatingLabel controlId={`answer-${question}`} label="Your Answer" className="mt-2">
                                <Form.Control
                                    type="text"
                                    placeholder="Answer"
                                    value={userData.answers[question] || ''}
                                    onChange={(e) => handleQuestionChange(question, e.target.value)}
                                />
                            </FloatingLabel>
                        )}
                    </div>
                ))}

                <Button variant="primary" onClick={handleSubmit} className="mt-3">
                    Save Changes
                </Button>
            </Form>
        </Card>
    );
};

export default ProfileComp;
