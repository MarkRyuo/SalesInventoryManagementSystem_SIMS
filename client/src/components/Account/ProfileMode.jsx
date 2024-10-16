import { useEffect, useState } from "react";
import { Image, Button } from "react-bootstrap";
import { MainLayout } from "../../layout/MainLayout";
import { Link } from "react-router-dom";
import { db } from '../../firebase'; // Adjust the path according to your project structure
import { doc, getDoc } from "firebase/firestore";

function ProfileMode() {
    const [adminData, setAdminData] = useState(null);
    const [loading, setLoading] = useState(true);
    const adminId = localStorage.getItem('adminId'); // Retrieve the adminId from localStorage

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                if (adminId) {
                    const adminDocRef = doc(db, "admins", adminId);
                    const adminDoc = await getDoc(adminDocRef);

                    if (adminDoc.exists()) {
                        setAdminData(adminDoc.data());
                    } else {
                        console.error("No such document!");
                    }
                }
            } catch (error) {
                console.error("Error fetching admin data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAdminData();
    }, [adminId]);

    if (loading) {
        return <div>Loading...</div>; // Optional: Show a loading message or spinner
    }

    return (
        <MainLayout>
            <div style={{ padding: '20px', marginTop: 100, boxShadow: '2px 4px 5px ', borderRadius: 20 }}>
                <div className="content">
                    <div style={{ display: "flex", padding: 20 }}>
                        <Image style={{ width: "100%", maxWidth: '100px', marginRight: 10 }} src="https://i.pinimg.com/564x/01/19/1f/01191fd3ece2dcd44122ff6d88149abc.jpg" roundedCircle />
                        <div style={{ display: 'flex', width: '100%', justifyContent: "space-between", alignItems: "center" }}>
                            <div style={{ display: "flex", flexDirection: 'column' }}>
                                <p className="fs-4 m-0">{adminData ? adminData.firstname : 'N/A'}</p>
                                <p className="fs-6 m-1">Administrator</p>
                            </div>
                            <Button as={Link} to={'/MyProfile'} variant="outline-primary">Edit Profile</Button>
                        </div>
                    </div>

                    <div style={{ padding: 20 }}>
                        <p className="fs-4">Personal Information</p>
                        <hr />
                        <div style={{ borderRadius: 20, padding: 20, boxShadow: '1px 1px 5px' }}>
                            <p>FirstName: <span>{adminData ? adminData.firstname : 'N/A'}</span></p>
                            <p>LastName: <span>{adminData ? adminData.lastname : 'N/A'}</span></p>
                            <p>Gender: <span>{adminData ? adminData.gender : 'N/A'}</span></p>
                            <p>Username: <span>{adminData ? adminData.username : 'N/A'}</span></p>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}

export default ProfileMode;
