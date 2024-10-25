import { useEffect, useState } from "react";
import { Image, Button } from "react-bootstrap";
import { MainLayout } from "../../layout/MainLayout";
import { Link } from "react-router-dom";
import { db } from '../../services/firebase'; // Adjust the path according to your project structure
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

    return (
        <MainLayout>
            <div style={{ marginTop: 100, boxShadow: '2px 5px 5px #E1E4E4 ', borderRadius: 15, width: '100%', minWidth: 400}}>
                <div className="content">
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '50px' }}>
                            <p className="fs-4">Loading...</p>
                        </div>
                    ) : (
                        <>
                            <div style={{ display: "flex", padding: 15 }}>
                                <Image style={{ width: "100px", marginRight: 10 }} src="../../assets/ReyesElectronicsLogo.png" roundedCircle />
                                <div style={{ display: 'flex', width: '100%', justifyContent: "space-between", alignItems: "center" }}>
                                    <div style={{ display: "flex", flexDirection: 'column' }}>
                                        <p className="fs-4 m-0">{adminData ? adminData.firstname : 'N/A'} {adminData ? adminData.lastname : 'N/A'}</p>
                                        <p className="fs-6 m-0">Administrator</p>
                                    </div>
                                    <Button as={Link} to={'/MyProfile'} variant="outline-primary">Edit Profile</Button>
                                </div>
                            </div>

                            <div style={{ padding: 20 }}>
                                <p className="fs-4">Personal Information</p>
                                <hr />
                                    <div style={{ borderRadius: 20, padding: 20, boxShadow: '1px 4px 5px #E1E4E4' }}>
                                    <p>FirstName: <span>{adminData ? adminData.firstname : 'N/A'}</span></p>
                                    <p>LastName: <span>{adminData ? adminData.lastname : 'N/A'}</span></p>
                                    <p>Gender: <span>{adminData ? adminData.gender : 'N/A'}</span></p>
                                    <p>Username: <span>{adminData ? adminData.username : 'N/A'}</span></p>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}

export default ProfileMode;
