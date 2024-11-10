import MainStaffLayout from "../../layout/MainStaffLayout";
import { Image } from "react-bootstrap";
import SDashboardCss from './SDashboard.module.css';
import { useState, useEffect } from "react";
import StaffButtons from "../../components/StaffPortal/StaffButtons/StaffButtons";
import { TiDocumentAdd } from "react-icons/ti";
import { BiScan } from "react-icons/bi";
import { MdOutlineManageSearch } from "react-icons/md";
import { getAllProducts } from "../../services/ProductService"; // Import your product service
import CardProduct from "../../components/StaffPortal/Cards/CardProduct";
import { LiaProductHunt } from 'react-icons/lia'; // Ensure this is correctly imported
import { db } from "../../services/firebase";
import { doc, getDoc } from "firebase/firestore";

function SDashboard() {
    const [staffName, setStaffName] = useState({ firstname: "", lastname: "", gender: "" });
    const [currentDate, setCurrentDate] = useState("");
    const [loading, setLoading] = useState(true);
    const [productsToday, setProductsToday] = useState([]);

    const [buttons] = useState([
        { btnName: "Add New Product", btnIcon: <TiDocumentAdd size={60} />, path: "/AddNewAssets", id: 1 },
        { btnName: "Point of Sale", btnIcon: <BiScan size={60} />, path: "/ScanAsset", id: 2 },
        { btnName: "Search Products", btnIcon: <MdOutlineManageSearch size={60} />, path: "/SearchAssets", id: 3 },
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

        // Fetch products added today and existing products with updated quantity
        const fetchProductsAddedOrUpdatedToday = async () => {
            try {
                const products = await getAllProducts();
                const today = new Date().toISOString().split('T')[0];

                // Filter products added today or updated today
                const productsToday = products.filter(product => {
                    // Check if dateAdded matches today
                    const isAddedToday = product.dateAdded === today;

                    // Check if any entry in quantityHistory has today's date
                    const isUpdatedToday = product.quantityHistory?.some(entry => entry.date === today);

                    return isAddedToday || isUpdatedToday;
                });

                // Map products to include the latest quantity
                const mappedProductsToday = productsToday.map(product => {
                    // Default to current quantity
                    let quantity = product.quantity;

                    // Update quantity if today's entry exists in history
                    const todayEntry = product.quantityHistory?.find(entry => entry.date === today);
                    if (todayEntry) {
                        quantity = todayEntry.quantity;
                    }

                    return {
                        ...product,
                        quantity,
                    };
                });

                console.log("Products added or updated today:", mappedProductsToday); // Debug log
                setProductsToday(mappedProductsToday);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };



        // Fetch staff details and products on component mount
        fetchStaffDetails();
        fetchProductsAddedOrUpdatedToday();

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
                                src="/ReyesElectronicsLogo.png"
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
                                <p className="fs-6 m-0 ps-4">Products Added or Updated Today</p>
                                <div className={SDashboardCss.contentCardProduct}>
                                    {productsToday.length > 0 ? (
                                        <CardProduct
                                            cardProduct={productsToday.map(product => ({
                                                productIcon: <LiaProductHunt size={25} />,
                                                productName: product.productName,
                                                productValue: `${product.sku}`,
                                                price: `${product.price}`, // Add the price here
                                                Quantity: `${product.quantity}`,
                                                id: product.barcode
                                            }))}
                                        />
                                    ) : (
                                        <p>No products added or updated today.</p>
                                    )}
                                </div>
                            </div>

                    </>
                )}
            </div>
        </MainStaffLayout>
    );
}

export default SDashboard;
