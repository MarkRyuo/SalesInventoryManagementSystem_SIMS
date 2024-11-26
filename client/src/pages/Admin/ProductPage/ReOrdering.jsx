import { useEffect, useState } from "react";
import { fetchReorderingProducts, saveOrderToFirebase } from "../../../services/ProductService";
import { Spinner, Button, Badge, Container, Modal, Table } from "react-bootstrap"; // Add Table here
import SavedOrderDetails from "./SavedOrderDetails";
import ReOrderingscss from './SCSS/ReOrdering.module.scss';
import { FaTruckLoading } from "react-icons/fa";
import { MdOutlineViewInAr } from "react-icons/md";
import { FaTruckRampBox } from "react-icons/fa6";

function ReOrdering() {
    const [reorderingProducts, setReorderingProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showProductModal, setShowProductModal] = useState(false);
    const [showReorderModal, setShowReorderModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [reorderList, setReorderList] = useState([]);
    const [reorderedProducts, setReorderedProducts] = useState(new Set());

    // Fetch data when needed
    const fetchData = async () => {
        try {
            const products = await fetchReorderingProducts();
            setReorderingProducts(products);
        } catch (error) {
            console.error("Error fetching reordering products:", error);
        }
    };

    useEffect(() => {
        setLoading(true);
        fetchData().then(() => setLoading(false));

        // Retrieve reorder list from localStorage on mount
        const savedReorderList = JSON.parse(localStorage.getItem("reorderList"));
        if (savedReorderList) {
            setReorderList(savedReorderList);
            const reorderedProductBarcodes = new Set(savedReorderList.map((item) => item.barcode));
            setReorderedProducts(reorderedProductBarcodes);
        }
    }, []);

    // Open Product Modal
    const handleViewProduct = (product) => {
        setSelectedProduct(product);
        setShowProductModal(true);
    };

    // Add product to the reorder list and track reordered products
    const handleReorderProduct = (product) => {
        // Check if the product already exists in the reorder list to avoid duplicates
        if (reorderList.find(item => item.barcode === product.barcode)) {
            return; // If already exists, do nothing
        }

        // Add product to reorder list
        setReorderList((prevList) => {
            const updatedList = [...prevList, product];
            localStorage.setItem("reorderList", JSON.stringify(updatedList));
            return updatedList;
        });

        setReorderedProducts((prevSet) => new Set(prevSet).add(product.barcode));

        setReorderingProducts((prevProducts) =>
            prevProducts.filter((item) => item.barcode !== product.barcode)
        );

        setShowProductModal(false);
    };

    const handleSaveOrderToFirebase = async () => {
        if (reorderList.length === 0) {
            alert("The reorder list is empty! Please add products before saving.");
            return;
        }

        try {
            const orderId = `order-${Date.now()}`;
            const orderDate = new Date().toISOString();

            const orderDetails = reorderList.map((product) => ({
                barcode: product.barcode,
                productName: product.productName,
                sku: product.sku,
                quantity: product.quantity, // Save the updated quantity
            }));

            const orderData = {
                id: orderId,
                date: orderDate,
                products: orderDetails,
            };

            await saveOrderToFirebase(orderData);
            alert("Order saved successfully to Firebase!");

            // Update reordered products state after saving
            const reorderedProductBarcodes = new Set(orderDetails.map((product) => product.barcode));
            setReorderedProducts((prevSet) => {
                const updatedSet = new Set(prevSet);
                orderDetails.forEach((product) => updatedSet.add(product.barcode));
                return updatedSet;
            });

            // Remove reordered products from reordering list
            setReorderingProducts((prevProducts) =>
                prevProducts.filter((product) => !reorderedProductBarcodes.has(product.barcode))
            );

            // Clear reorder list and localStorage
            setReorderList([]);
            localStorage.removeItem("reorderList");

            // Hide the reorder modal after saving
            setShowReorderModal(false);
        } catch (error) {
            console.error("Error saving order to Firebase:", error);
            alert("Error saving order!");
        }
    };


    // Filter out reordered products from the list
    const filteredReorderingProducts = reorderingProducts.filter((product) => !reorderedProducts.has(product.barcode));
    // Handle modal open and close
    const handleOpenReorderModal = () => setShowReorderModal(true);
    const handleCloseModals = () => {
        setShowProductModal(false);
        setShowReorderModal(false);
    };

    return (
        <Container className="m-0 p-0">
            <main className={ReOrderingscss.mainReOrdering}>
                <h4 className="my-2"><FaTruckLoading size={25} className="me-2" />Reordering Dashboard</h4>
                <div className={ReOrderingscss.TopButtons}>
                    <Button variant="primary" onClick={handleOpenReorderModal} className="mt-3">
                        <MdOutlineViewInAr size={17} className="me-1"/>View Reordered Product
                    </Button>
                    <SavedOrderDetails />
                </div>
                {loading ? (
                    <div className="d-flex justify-content-center">
                        <Spinner animation="border" variant="primary" />
                    </div>
                ) : (
                    <div>
                        {filteredReorderingProducts.length > 0 ? (
                            <div className="mt-3">
                                <div className={ReOrderingscss.containerReordering}>
                                    {filteredReorderingProducts.map((product) => {
                                        const isOutOfStock = product.quantity === 0;
                                        const isLowStock = product.quantity > 0 && product.quantity <= product.instockthreshold / 4;

                                        const statusBadge = isOutOfStock ? (
                                            <Badge bg="danger">Out of Stock</Badge>
                                        ) : (
                                            isLowStock && <Badge bg="warning">Low Stock</Badge>
                                        );

                                        // Skip products that don't need reordering
                                        if (!isOutOfStock && !isLowStock) return null;

                                        return (
                                            <div key={product.barcode}>
                                                <div className={ReOrderingscss.CardBody}>
                                                    <div>
                                                        <h4>{product.productName}</h4>
                                                        <p className="m-0">SKU: {product.sku}</p>
                                                        <p className="m-0">Quantity: {product.quantity}</p>
                                                        <p className="m-0">Status: {statusBadge}</p>
                                                    </div>
                                                    <div>
                                                        <Button variant="success" onClick={() => handleViewProduct(product)}>
                                                            Reorder
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}

                                </div>
                            </div>
                        ) : (
                            <p className="text-muted text-center">No products need reordering.</p>
                        )}
                    </div>
                )}

                {/* Product Details Modal */}
                <Modal show={showProductModal} onHide={handleCloseModals} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Product Details</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {selectedProduct && (
                            <div>
                                <p><strong>Name:</strong> {selectedProduct.productName}</p>
                                <p><strong>SKU:</strong> {selectedProduct.sku}</p>
                                <p><strong>Quantity:</strong> {selectedProduct.quantity}</p>
                            </div>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModals}>Close</Button>
                        <Button variant="success" onClick={() => handleReorderProduct(selectedProduct)}>
                            Add to Reorder List
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/* Reorder List Modal */}
                <Modal show={showReorderModal} onHide={handleCloseModals} centered>
                    <Modal.Header closeButton>
                        <Modal.Title><FaTruckRampBox size={20} className="me-2" />Reorder List</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {reorderList.length > 0 ? (
                            <Table bordered hover responsive>
                                <thead className="bg-light">
                                    <tr>
                                        <th>Product Name</th>
                                        <th>SKU</th>
                                        <th>Quantity</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reorderList.map((product, index) => (
                                        <tr key={product.barcode}>
                                            <td className="fs-6">{product.productName}</td>
                                            <td className="fs-6">{product.sku}</td>
                                            <td>
                                                <div className="d-flex justify-content-center">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        value={product.quantity || 0}
                                                        onChange={(e) => {
                                                            const newQuantity = e.target.value;
                                                            const validQuantity = isNaN(newQuantity) || newQuantity === '' ? 0 : parseInt(newQuantity, 10);

                                                            setReorderList((prevList) => {
                                                                const updatedList = [...prevList];
                                                                updatedList[index] = {
                                                                    ...updatedList[index],
                                                                    quantity: validQuantity,
                                                                };
                                                                localStorage.setItem("reorderList", JSON.stringify(updatedList));
                                                                return updatedList;
                                                            });
                                                        }}
                                                        style={{
                                                            width: "80px",
                                                            padding: "5px",
                                                            fontSize: "1rem",
                                                            borderRadius: "5px",
                                                            borderColor: "#ccc",
                                                            textAlign: "center",
                                                        }}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        ) : (
                            <p className="text-center text-muted">No products added to reorder list.</p>
                        )}
                    </Modal.Body>
                    <Modal.Footer className="bg-light">
                        <Button
                            variant="danger"
                            onClick={() => {
                                setReorderList([]);
                                localStorage.removeItem("reorderList");
                            }}
                        >
                            Clear List
                        </Button>
                        <Button variant="success" onClick={handleSaveOrderToFirebase}>Save Order</Button>
                    </Modal.Footer>
                </Modal>


            </main>
        </Container>
    );
}

export default ReOrdering;
