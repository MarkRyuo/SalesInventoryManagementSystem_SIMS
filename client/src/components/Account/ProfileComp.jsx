/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { Button, Form, FloatingLabel, Card } from 'react-bootstrap';
import { db } from '../../services/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const ProfileComp = ({ adminId }) => {
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [gender, setGender] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [selectedQuestions, setSelectedQuestions] = useState([]);
    const [answers, setAnswers] = useState({});

    const availableQuestions = [
        "In which city was your first business located?",
        "What year did you start your business?",
        "What is the name of your first school?",
        "What is your favorite color?",
        "What city were you born in?"
    ];

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                // Log the adminId to ensure it's being passed correctly
                console.log('Fetching data for adminId:', adminId);

                // Example of a hardcoded adminId for testing:
                // const docRef = doc(db, 'admins', 'exampleAdminId');
                const docRef = doc(db, 'admins', adminId); // Use the adminId prop
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    console.log('Fetched data:', data); // See what data is retrieved

                    setFirstname(data.firstname || '');
                    setLastname(data.lastname || '');
                    setGender(data.gender || '');
                    setUsername(data.username || '');
                    setPassword(data.password || '');
                    setSelectedQuestions(data.selectedQuestions || []);
                    setAnswers(data.answers || {});
                } else {
                    console.error('Admin profile not found.');
                }
            } catch (error) {
                console.error('Error fetching profile data:', error.message);
            }
        };

        fetchProfileData();
    }, [adminId]);

    const handleQuestionChange = (question, answer) => {
        setAnswers((prevAnswers) => ({ ...prevAnswers, [question]: answer }));
    };

    const handleSubmit = async () => {
        try {
            if (selectedQuestions.length !== 3) {
                alert('Please select exactly 3 recovery questions.');
                return;
            }

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

    const handleQuestionSelection = (question) => {
        setSelectedQuestions((prevQuestions) => {
            if (prevQuestions.includes(question)) {
                return prevQuestions.filter((q) => q !== question);
            } else if (prevQuestions.length < 3) {
                return [...prevQuestions, question];
            }
            return prevQuestions;
        });
    };

    return (
        <Card style={{ padding: '20px', margin: '20px' }}>
            <h2>Profile Information</h2>
            <Form>
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
                        <option value="Other">Other</option>
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
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </FloatingLabel>

                <h4>Select 3 Recovery Questions</h4>
                {availableQuestions.map((question) => (
                    <div key={question} className="mb-3">
                        <Form.Check
                            type="checkbox"
                            label={question}
                            checked={selectedQuestions.includes(question)}
                            onChange={() => handleQuestionSelection(question)}
                        />
                        {selectedQuestions.includes(question) && (
                            <FloatingLabel controlId={`answer-${question}`} label="Your Answer" className="mt-2">
                                <Form.Control
                                    type="text"
                                    placeholder="Answer"
                                    value={answers[question] || ''}
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
