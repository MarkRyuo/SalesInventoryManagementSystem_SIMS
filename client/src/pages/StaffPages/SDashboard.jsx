import MainStaffLayout from "../../layout/MainStaffLayout";
import { Image } from "react-bootstrap";
import { useState, useEffect } from "react";
import { db } from "../../services/firebase";
import { doc, getDoc } from "firebase/firestore";
import StaffDashboardScss from '../Staff/StaffDashboard/StaffDashboard.module.scss';
import { MdSpaceDashboard } from "react-icons/md";


function SDashboard() {
    const [staffName, setStaffName] = useState({ firstname: "", lastname: "", gender: "" });
    const [currentDate, setCurrentDate] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch staff details from Firestore
        const fetchStaffDetails = async () => {
            try {
                const staffId = localStorage.getItem('staffId');
                const docRef = doc(db, "staffs", staffId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const { firstname, lastname, gender } = docSnap.data();
                    setStaffName({ firstname, lastname, gender });
                } else {
                    console.error("No such document!");
                }
            } catch (error) {
                console.error("Error fetching staff data:", error);
            } finally {
                setLoading(false); // Set loading to false once data is fetched
            }
        };
        // Fetch staff details and products on component mount
        fetchStaffDetails();

        // Set the current date
        const today = new Date();
        const dateString = today.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
        setCurrentDate(dateString);
    }, []);

    // Determine the title based on the gender
    const getTitle = (gender) => {
        return gender === "male" ? "Mr." : "Ms.";
    };

    return (
        <MainStaffLayout>
            <div className={StaffDashboardScss.mainTopComponent}>
                <div className={StaffDashboardScss.componentHeroCard}>
                    <h1 className='d-flex'><MdSpaceDashboard size={25} className='mt-2 p-0' />Dashboard</h1>
                    {loading ? (
                        // Display a loading indicator while data is being fetched
                        <div className={StaffDashboardScss.loadingContainer}>
                            <p>Loading staff Dashboard...</p>
                        </div>
                    ) : (
                        <div className={StaffDashboardScss.credentialDashboard}>
                            <Image
                                src="/Reyes_Electronics_LogoBg.png"
                                roundedCircle
                            />
                            <div>
                                <h4 className="m-0">
                                    <span className="fw-semibold">Hello, </span> <span>{getTitle(staffName.gender)} {staffName.firstname} {staffName.lastname}</span>
                                </h4>
                                <p className="m-0">REYES ELECTRONICS.</p>
                                <p className="m-0">{currentDate}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </MainStaffLayout>
    );
}

export default SDashboard;
