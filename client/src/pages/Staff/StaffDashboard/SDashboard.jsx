/* eslint-disable react-hooks/exhaustive-deps */
import MainStaffLayout from "../../../layout/MainStaffLayout";
import { Image } from "react-bootstrap";
import { useState, useEffect } from "react";
import { db } from "../../../services/firebase";
import { doc, getDoc } from "firebase/firestore";
import StaffDashboardScss from './StaffDashboard.module.scss';
import StaffButtons from "../../../components/StaffPortal/StaffButtons/StaffButtons";
import { TiDocumentAdd } from "react-icons/ti";
import { BiScan } from "react-icons/bi";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection

//? Charts
import StaffChart1 from '../../../components/Charts/StaffDashBoardChart/StaffChart1'
import StaffChart2 from '../../../components/Charts/StaffDashBoardChart/StaffChart2';
import StaffChart3 from '../../../components/Charts/StaffDashBoardChart/StaffChart3';
import StaffChartLg1 from '../../../components/Charts/StaffDashBoardChart/StaffChartLg1';
import StaffChart4 from '../../../components/Charts/StaffDashBoardChart/StaffChart4';

function SDashboard() {
    const [staffName, setStaffName] = useState({ firstname: "", lastname: "", gender: "" });
    const [currentDate, setCurrentDate] = useState("");
    const [loading, setLoading] = useState(true);
    const [sessionTimer, setSessionTimer] = useState(null); // Track session timeout
    const navigate = useNavigate(); // Navigate for auto logout

    const [buttons] = useState([
        { btnName: "Add New Product", btnIcon: <TiDocumentAdd size={60} />, path: "/AddNewAssets", id: 1 },
        { btnName: "Point of Sale", btnIcon: <BiScan size={60} />, path: "/ScanAsset", id: 2 },
    ]);

    // Function to handle session timeout
    const startSessionTimer = () => {
        // Logout after 30 minutes
        const timer = setTimeout(() => {
            alert("Session expired due to inactivity.");
            localStorage.removeItem('staffId');
            navigate("/"); // Redirect to login page
        }, 30 * 60 * 1000); // 30 minutes in milliseconds
        setSessionTimer(timer);
    };

    useEffect(() => {
        // Fetch staff details from Firestore
        const fetchStaffDetails = async () => {
            try {
                const staffId = localStorage.getItem('staffId');
                if (!staffId) {
                    alert("Staff ID not found. Logging out.");
                    localStorage.removeItem('staffId');
                    navigate("/"); // Redirect to login page if no staff ID found
                    return;
                }

                const docRef = doc(db, "staffs", staffId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const { firstname, lastname, gender } = docSnap.data();
                    setStaffName({ firstname, lastname, gender });
                } else {
                    console.error("No such document!");
                    alert("Staff data not found. Logging out.");
                    localStorage.removeItem('staffId');
                    navigate("/"); // Redirect to login page if staff data not found
                }
            } catch (error) {
                console.error("Error fetching staff data:", error);
            } finally {
                setLoading(false); // Stop loading when data fetch is complete
                startSessionTimer(); // Start session timer once data is fetched
            }
        };

        fetchStaffDetails();

        // Set the current date
        const today = new Date();
        const dateString = today.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
        setCurrentDate(dateString);

        // Cleanup on component unmount
        return () => {
            if (sessionTimer) {
                clearTimeout(sessionTimer); // Clear session timer on unmount
            }
        };
    }, []); // Empty dependency array to run only once

    // Determine the title based on the gender
    const getTitle = (gender) => {
        if (gender?.toLowerCase() === "male") return "Mr.";
        if (gender?.toLowerCase() === "female") return "Ms.";
        return ""; // Default title for unspecified gender
    };

    return (
        <MainStaffLayout>
            <div className={StaffDashboardScss.mainTopComponent}>
                <div className={StaffDashboardScss.componentHeroCard}>
                    <h1>Dashboard</h1>
                    {loading ? (
                        <div className="fs-4 text-center pt-5 mt-5">
                            <p>Loading Staff Dashboard...</p>
                        </div>
                    ) : (
                        <div className={StaffDashboardScss.credentialDashboard}>
                            <Image
                                src="/Reyes_Electronics_LogoBg.png"
                                roundedCircle
                            />
                            <div>
                                <h4 className="m-0">
                                    <span className="fw-semibold">Hello, </span>
                                    <span>{getTitle(staffName.gender)} {staffName.firstname} {staffName.lastname}</span>
                                </h4>
                                <p className="m-0">REYES ELECTRONICS.</p>
                                <p className="m-0">{currentDate}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {!loading && (
                <div className={StaffDashboardScss.smallContainer}>
                    <div>
                        <StaffChart1 />
                        <StaffChart2 />
                        <StaffChart3 />
                        <StaffChart4 />
                    </div>
                    <div className={StaffDashboardScss.largeContainer}>
                        <div className={StaffDashboardScss.buttonsHeroCard}>
                            <StaffButtons buttons={buttons.filter(button => button.id === 1)} />
                            <StaffButtons buttons={buttons.filter(button => button.id === 2)} />
                        </div>
                        <StaffChartLg1 />
                    </div>
                </div>
            )}
        </MainStaffLayout>
    );
}

export default SDashboard;
