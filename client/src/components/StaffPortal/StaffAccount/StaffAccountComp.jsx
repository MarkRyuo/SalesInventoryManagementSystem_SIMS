import { Row, Form, Col } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { db } from '../../../services/firebase'; // Adjust the path to your Firebase configuration
import { doc, getDoc } from "firebase/firestore";

const StaffAccountComp = () => {
    const [staffData, setStaffData] = useState(null); // State to hold staff data

    useEffect(() => {
        const fetchStaffData = async () => {
            const staffId = localStorage.getItem('staffId'); // Get the staffId from localStorage
            if (staffId) {
                try {
                    const staffDoc = await getDoc(doc(db, "staffs", staffId)); // Fetch the staff document
                    if (staffDoc.exists()) {
                        setStaffData(staffDoc.data()); // Set the staff data to state
                    } else {
                        console.error("No such staff document!");
                    }
                } catch (error) {
                    console.error("Error fetching staff data:", error);
                }
            }
        };

        fetchStaffData(); // Call the fetch function
    }, []);

    return (
        <Form>

            <Row style={{ width: "100%", margin: 0, padding: 0 }}>
                <Col lg={6}>
                    <Form.Group className="mb-3" controlId="firstName">
                        <Form.Label>FIRST NAME</Form.Label>
                        <Form.Control
                            type="text"
                            defaultValue={staffData ? staffData.firstname : ''} // Bind first name
                        />
                    </Form.Group>
                </Col>
                <Col lg={6}>
                    <Form.Group className="mb-3" controlId="lastName">
                        <Form.Label>LAST NAME</Form.Label>
                        <Form.Control
                            type="text"
                            defaultValue={staffData ? staffData.lastname : ''} // Bind last name
                        />
                    </Form.Group>
                </Col>
            </Row>

            {/* Gender */}
            <Form.Group
                className="mb-3"
                controlId="gender"
                style={{ width: "100%", maxWidth: "500px", paddingLeft: 10 }}>
                <Form.Label>Gender</Form.Label>
                <Form.Control
                    type="text"
                    defaultValue={staffData ? staffData.gender : ''} // Bind gender
                />
            </Form.Group>

            {/* Username */}
            <Form.Group
                className="mb-3"
                controlId="username"
                style={{ width: "100%", maxWidth: "500px", paddingLeft: 10 }}>
                <Form.Label>Username</Form.Label>
                <Form.Control
                    type="text"
                    defaultValue={staffData ? staffData.username : ''} // Bind username
                />
            </Form.Group>

            {/* Password */}
            <Form.Group
                className="mb-3"
                controlId="password"
                style={{ width: "100%", maxWidth: "500px", paddingLeft: 10 }}>
                <Form.Label>Password</Form.Label>
                <Form.Control
                    type="password"
                    defaultValue={staffData ? staffData.password : ''} // Bind password
                    readOnly // Make the password field read-only
                />
            </Form.Group>

        </Form>
    );
}

export default StaffAccountComp;
