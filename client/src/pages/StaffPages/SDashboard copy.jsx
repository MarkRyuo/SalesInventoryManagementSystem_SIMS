import MainStaffLayout from "../../layout/MainStaffLayout";
import { Image } from "react-bootstrap";
import SDashboardCss from './SDashboard.module.scss';
import { useState, useEffect } from "react";
import StaffButtons from "../../components/StaffPortal/StaffButtons/StaffButtons";
import { TiDocumentAdd } from "react-icons/ti";
import { BiScan } from "react-icons/bi";
import { MdOutlineManageSearch } from "react-icons/md";
import { getAllProducts} from "../../services/ProductService"; // Import your product service
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
                const products = await getAllProducts(); // Fetch all products
                const today = new Date();
                const philippineOffset = 8 * 60; // Philippine Time Zone Offset (UTC +8)
                const localTime = new Date(today.getTime() + (philippineOffset - today.getTimezoneOffset()) * 60000);
                const formattedToday = localTime.toISOString().split('T')[0];

                console.log("Formatted Today:", formattedToday);

                // Filter products based on `dateAdded` or `quantityHistory`
                const productsToday = products.filter(product => {
                    const dateAdded = product.dateAdded && String(product.dateAdded).split('T')[0];
                    const isAddedToday = dateAdded === formattedToday;

                    const isUpdatedToday = product.quantityHistory?.some(entry => {
                        const entryDate = String(entry.date).split('T')[0]; // Ensure consistent format
                        return entryDate === formattedToday;
                    });

                    return isAddedToday || isUpdatedToday;
                });

                const mappedProductsToday = productsToday.map(product => {
                    let quantity = product.quantity;

                    // Locate today's quantity entry in quantity history
                    const todayEntry = product.quantityHistory?.find(entry => {
                        const entryDate = String(entry.date).split('T')[0];
                        return entryDate === formattedToday;
                    });
                    if (todayEntry) {
                        quantity = todayEntry.quantity;
                    }

                    return {
                        ...product,
                        quantity,
                    };
                });

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
                                src="/Reyes_Electronics_LogoBg.png"
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
