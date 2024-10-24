import MainStaffLayout from "../../layout/MainStaffLayout";
import { Image } from "react-bootstrap";
import SDashboardCss from './SDashboard.module.css';
import { useState, useEffect } from "react";
import StaffButtons from "../../components/StaffPortal/StaffButtons/StaffButtons";
import { TiDocumentAdd } from "react-icons/ti";
import { BiScan } from "react-icons/bi";
import { MdOutlineManageSearch } from "react-icons/md";
import { LiaProductHunt } from "react-icons/lia";
import CardProduct from "../../components/StaffPortal/Cards/CardProduct";
import { db } from "../../services/firebase";
import { doc, getDoc } from "firebase/firestore";

function SDashboard() {
    const [staffName, setStaffName] = useState({ firstname: "", lastname: "", gender: "" });
    const [currentDate, setCurrentDate] = useState("");
    const [loading, setLoading] = useState(true);

    const [buttons] = useState([
        { btnName: "AddNewAssets", btnIcon: <TiDocumentAdd size={80} />, path: "/AddNewAssets", id: 1 },
        { btnName: "ScanAssets", btnIcon: <BiScan size={80} />, path: "/ScanAsset", id: 2 },
        { btnName: "SearchAssets", btnIcon: <MdOutlineManageSearch size={80} />, path: "/SearchAssets", id: 3 },
    ]);

    const [cardProduct] = useState([
        {
            productIcon: <LiaProductHunt size={30} />,
            productName: 'Sample',
            productValue: '01213224234',
            id: 'p1'
        }
    ]);

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

        // Fetch staff details on component mount
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
            <div className={SDashboardCss.mainComponent}>
                {loading ? (
                    // Display a loading indicator while data is being fetched
                    <div className={SDashboardCss.loadingContainer}>
                        <p>Loading staff Dashboard...</p>
                    </div>
                ) : (
                    <>
                        <div className={SDashboardCss.componentHeroCard}>
                            <Image
                                src="https://i.pinimg.com/control/564x/6a/61/32/6a6132119767a37330924720a5733a96.jpg"
                                roundedCircle
                                style={{ width: '100%', maxWidth: '100px', height: '100px' }}
                            />
                            <div>
                                <p className="fs-4 m-0">
                                    <span className="fw-semibold">Hello, </span>
                                    <span>{getTitle(staffName.gender)} {staffName.firstname} {staffName.lastname}</span>
                                </p>
                                <p className="m-0">REYES ELECTRONICS.</p>
                                <p>{currentDate}</p>
                            </div>
                        </div>

                        <div className={SDashboardCss.containerHeroCard}>
                            <p className="fs-5 m-0 ps-4">Services</p>
                            <div className={SDashboardCss.buttonsHeroCard}>
                                <StaffButtons buttons={buttons.filter(button => button.id === 1)} />
                                <StaffButtons buttons={buttons.filter(button => button.id === 2)} />
                                <StaffButtons buttons={buttons.filter(button => button.id === 3)} />
                            </div>
                        </div>

                        <div className={SDashboardCss.containerCardProduct}>
                            <p className="fs-5 m-0 ps-4">Product Add Today:</p>
                            <div className={SDashboardCss.contentCardProduct}>
                                <CardProduct cardProduct={cardProduct.filter(CardProducts => CardProducts.id === 'p1')} />
                            </div>
                        </div>
                    </>
                )}
            </div>
        </MainStaffLayout>
    );
}

export default SDashboard;
