import { useEffect, useState } from 'react';
import { Form, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../services/firebase'; // Update path as needed

const StaffAccountComp = () => {
    const [staffData, setStaffData] = useState(null); // State to hold staff data
    const [loading, setLoading] = useState(true); // Loading state
    const navigate = useNavigate(); // Initialize navigate

    useEffect(() => {
        const fetchStaffData = async () => {
            const staffId = localStorage.getItem('staffId'); // Get the staffId from localStorage
            if (!staffId) {
                alert("No staff ID found. Please log in.");
                navigate("/Slogin"); // Redirect to login if no ID found
                return;
            }

            try {
                const staffDocRef = doc(db, "staffs", staffId); // Reference to the staff document
                const staffDoc = await getDoc(staffDocRef); // Fetch the staff document

                if (staffDoc.exists()) {
                    setStaffData(staffDoc.data()); // Set the staff data to state
                } else {
                    alert("No such staff document!");
                }
            } catch (error) {
                console.error("Error fetching staff data:", error);
                alert("Failed to fetch staff data.");
            } finally {
                setLoading(false); // Stop loading regardless of success or failure
            }
        };

        fetchStaffData(); // Call the fetch function
    }, [navigate]); // Add navigate as a dependency

    if (loading) {
        return <Spinner animation="border" />; // Show loading spinner while fetching
    }

    return (
        <Form>
            {/* Display staff details */}
            {staffData && (
                <>
                    <Form.Group className="mb-3" controlId="firstName">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control
                            type="text"
                            defaultValue={staffData.firstname} // Bind first name
                            readOnly // Make the field read-only
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="lastName">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control
                            type="text"
                            defaultValue={staffData.lastname} // Bind last name
                            readOnly // Make the field read-only
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="username">
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                            type="text"
                            defaultValue={staffData.username} // Bind username
                            readOnly // Make the field read-only
                        />
                    </Form.Group>
                </>
            )}
        </Form>
    );
};

export default StaffAccountComp;
