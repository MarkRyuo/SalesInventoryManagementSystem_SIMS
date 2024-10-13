import { useState } from 'react';
import { Spinner, Alert, Button } from 'react-bootstrap'; // Ensure you have react-bootstrap installed
import { db } from '../../../services/firebase'; // Update path as needed
import { doc, getDoc } from "firebase/firestore";

const StaffAccountComp = () => {
    // States to store the logged-in staff data, loading state, and error messages
    const [staffData, setStaffData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const staffId = localStorage.getItem('staffId'); // Get the logged-in staff ID from local storage

    // Function to fetch logged-in staff account details
    const fetchStaffAccount = async () => {
        if (!staffId) {
            setError("No staff ID found. Please log in again.");
            setLoading(false);
            return; // Check if staffId exists
        }

        try {
            const staffDocRef = doc(db, "staffs", staffId); // Reference to the specific staff document
            const staffDoc = await getDoc(staffDocRef); // Get the staff document

            if (staffDoc.exists()) {
                setStaffData({ id: staffDoc.id, ...staffDoc.data() }); // Set staff data if document exists
            } else {
                setError("No such staff account found!");
            }
        } catch (error) {
            console.error("Error fetching staff account details:", error);
            setError("Error fetching account details. Please try again later.");
        } finally {
            setLoading(false); // Set loading to false regardless of success or failure
        }
    };

    // Flag to track if the fetch has already been executed
    if (loading) {
        fetchStaffAccount();
    }

    // Handle logout action
    const handleLogout = () => {
        localStorage.removeItem('staffId'); // Clear the staff ID from local storage
        // Optionally navigate to the login page or perform other logout actions
        // navigate("/login"); // Uncomment and import navigate if needed
    };

    return (
        <>
            <h1>Your Account Details</h1>
            {loading ? (
                <Spinner animation="border" /> // Show loading spinner while fetching data
            ) : error ? (
                <Alert variant="danger">{error}</Alert> // Show error message if there's an error
            ) : (
                <div>
                    <p><strong>First Name:</strong> {staffData.firstname}</p>
                    <p><strong>Last Name:</strong> {staffData.lastname}</p>
                    <p><strong>Username:</strong> {staffData.username}</p>
                    <p><strong>Gender:</strong> {staffData.gender}</p>
                    <p><strong>Active:</strong> {staffData.active ? 'Yes' : 'No'}</p>
                </div>
            )}
            <Button variant="danger" onClick={handleLogout}>Logout</Button> {/* Add a logout button */}
        </>
    );
}

export default StaffAccountComp;
