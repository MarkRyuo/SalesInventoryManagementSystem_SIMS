import MainStaffLayout from "../../../layout/MainStaffLayout";
import { Image } from "react-bootstrap";
import { useState, useEffect } from "react";
import { db } from "../../../services/firebase";
import { doc, getDoc } from "firebase/firestore";
import StaffDashboardScss from './StaffDashboard.module.scss';
import { MdSpaceDashboard } from "react-icons/md";
import StaffButtons from "../../../components/StaffPortal/StaffButtons/StaffButtons";
import { TiDocumentAdd } from "react-icons/ti";
import { BiScan } from "react-icons/bi";

//? Charts
import StaffChart1 from '../../../components/Charts/StaffDashBoardChart/StaffChart1'
import Chart2 from '../../../components/Charts/DashboardChart/Chart2';
import Chart3 from '../../../components/Charts/DashboardChart/Chart3';
import ChartLg1 from '../../../components/Charts/DashboardChart/ChartLg1';
import Chart4 from '../../../components/Charts/DashboardChart/Chart4';

function SDashboard() {
    const [staffName, setStaffName] = useState({ firstname: "", lastname: "", gender: "" });
    const [currentDate, setCurrentDate] = useState("");
    const [loading, setLoading] = useState(true);

    const [buttons] = useState([
        { btnName: "Add New Product", btnIcon: <TiDocumentAdd size={60} />, path: "/AddNewAssets", id: 1 },
        { btnName: "Point of Sale", btnIcon: <BiScan size={60} />, path: "/ScanAsset", id: 2 },
    ]);

    useEffect(() => {
        // Fetch staff details from Firestore
        const fetchStaffDetails = async () => {
            try {
                const staffId = localStorage.getItem('staffId');
                if (!staffId) {
                    console.error("Staff ID not found in localStorage.");
                    setLoading(false);
                    return;
                }

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
                setLoading(false); // Stop loading when data fetch is complete
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
    }, []);

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
                <div className={StaffDashboardScss.chartContainer}>
                    <div className={StaffDashboardScss.smallContainer}>
                        <div>
                            <StaffChart1 />
                            <Chart2 />
                            <Chart3 />
                            <Chart4 />
                        </div>
                        <div className={StaffDashboardScss.largeContainer}>
                            <div className={StaffDashboardScss.buttonsHeroCard}>
                                <StaffButtons buttons={buttons.filter(button => button.id === 1)} />
                                <StaffButtons buttons={buttons.filter(button => button.id === 2)} />
                            </div>
                            <ChartLg1 />
                        </div>
                    </div>
                </div>
            )}
        </MainStaffLayout>
    );
}

export default SDashboard;
