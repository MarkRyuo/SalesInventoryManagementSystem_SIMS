import { useState, useEffect } from 'react';
import MainStaffLayout from "../../../layout/MainStaffLayout";
import { Image, Spinner } from "react-bootstrap";
import { db } from '../../../services/firebase'; // Import your Firebase configuration
import { doc, getDoc } from "firebase/firestore";
import StaffAccountScss from './StaffAccount.module.scss';

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
            <div className={StaffAccountScss.MainComponent}>
                {loading ? (
                    // Display a spinner or loading message while data is being fetched
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
                        <Spinner animation="grow" variant="success" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    </div>
                ) : (
                    <div className={StaffAccountScss.Mcontent}>
                        <div className={StaffAccountScss.content}>
                            <Image src="/Reyes_Electronics_LogoBg.png" roundedCircle />
                            <div className={StaffAccountScss.contentTitle}>
                                <div style={{ display: "flex", flexDirection: 'column' }}>
                                    <h1 className="m-0">{staffData?.firstname} {staffData?.lastname}</h1>
                                    <p className="m-0">REYES ELECTRONICS Staff</p>
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
