import { useState, useEffect } from 'react';
import MainStaffLayout from "../../../layout/MainStaffLayout";
import { Image, Spinner } from "react-bootstrap";
import { db } from '../../../services/firebase'; // Import your Firebase configuration
import { doc, getDoc } from "firebase/firestore";

function StaffAccountMode() {
    const [staffData, setStaffData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch the staff ID from localStorage
        const staffId = localStorage.getItem('staffId');

        // Function to fetch staff data from Firestore
        const fetchStaffData = async () => {
            if (!staffId) {
                setLoading(false);
                return; // Return if no staff ID found
            }

            try {
                const staffDocRef = doc(db, "staffs", staffId);
                const staffDoc = await getDoc(staffDocRef);

                if (staffDoc.exists()) {
                    setStaffData(staffDoc.data());
                } else {
                    console.log("No such staff document found!");
                }
            } catch (error) {
                console.error("Error fetching staff data:", error);
            } finally {
                setLoading(false); // Stop loading regardless of success or error
            }
        };

        fetchStaffData();
    }, []);

    return (
        <MainStaffLayout>
            <div style={{ marginTop: 100, boxShadow: '2px 5px 5px #E1E4E4', borderRadius: 15, width: '100%', minWidth: 400 }}>
                {loading ? (
                    // Display a spinner or loading message while data is being fetched
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    </div>
                ) : (
                    <div className="content">
                        <div style={{ display: "flex", padding: 10 }}>
                            <Image
                                style={{ width: 80, marginRight: 10, height: 80 }}
                                src="/Reyes_Electronics_LogoBg.png"
                                roundedCircle
                            />
                            <div style={{ display: 'flex', width: '100%', justifyContent: "space-between", alignItems: "center" }}>
                                <div style={{ display: "flex", flexDirection: 'column' }}>
                                    <p className="fs-4 m-0">{staffData?.firstname} {staffData?.lastname}</p>
                                    <p className="fs-6 m-0">REYES ELECTRONICS Staff</p>
                                </div>
                                <p style={{ color: staffData?.active ? 'green' : 'red' }}>
                                    {staffData?.active ? '● Active' : '● Inactive'}
                                </p>
                            </div>
                        </div>

                        <div style={{ padding: 20 }}>
                            <p className="fs-4">Personal Information</p>
                            <hr />
                            <div style={{ borderRadius: 20, padding: 20, boxShadow: '1px 4px 5px #E1E4E4' }}>
                                <p>FirstName: <span>{staffData?.firstname || 'N/A'}</span></p>
                                <p>LastName: <span>{staffData?.lastname || 'N/A'}</span></p>
                                <p>Gender: <span>{staffData?.gender || 'N/A'}</span></p>
                                <p>Username: <span>{staffData?.username || 'N/A'}</span></p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </MainStaffLayout>
    );
}

export default StaffAccountMode;
