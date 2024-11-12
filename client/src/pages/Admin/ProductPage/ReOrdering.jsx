import { useEffect, useState } from "react";
import { fetchReorderingProducts, fetchSavedOrders } from "../../../services/ProductService";  // Ensure you import fetchSavedOrders correctly
import { Table, Spinner, Button, Badge, Container, Modal } from "react-bootstrap";
import { jsPDF } from "jspdf";
import { saveOrderToFirebase } from "../../../services/ProductService";

function ReOrdering() {
    const [reorderingProducts, setReorderingProducts] = useState([]);
    const [savedOrders, setSavedOrders] = useState([]); // State to hold saved orders
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

    // Fetch saved orders from Firebase using the service function
    useEffect(() => {
        // Initially load data
        setLoading(true);
        fetchData().then(() => setLoading(false));

        // Fetch saved orders from Firebase
        const getSavedOrders = async () => {
            try {
                const orders = await fetchSavedOrders();  // Using the imported function
                setSavedOrders(orders); // Store the fetched orders
            } catch (error) {
                console.error("Error fetching saved orders:", error);
            }
        };

        getSavedOrders();

        // Retrieve reorder list from localStorage on mount
        const savedReorderList = JSON.parse(localStorage.getItem('reorderList'));
        if (savedReorderList) {
            setReorderList(savedReorderList);
            const reorderedProductBarcodes = new Set(savedReorderList.map(item => item.barcode));
            setReorderedProducts(reorderedProductBarcodes);
        }
    }, []); // Run once when the component mounts

    // Open Product Modal
    const handleViewProduct = (product) => {
        setSelectedProduct(product);
        setShowProductModal(true);
    };

    // Add product to the reorder list and track reordered products
    const handleReorderProduct = (product) => {
        setReorderList((prevList) => {
            const updatedList = [...prevList, product];
            localStorage.setItem('reorderList', JSON.stringify(updatedList)); // Save to localStorage
            return updatedList;
        });

        // Mark product as reordered
        setReorderedProducts((prevSet) => new Set(prevSet).add(product.barcode));

        // Remove the product from the reorderingProducts list
        setReorderingProducts((prevProducts) =>
            prevProducts.filter((item) => item.barcode !== product.barcode)
        );

        setShowProductModal(false);
    };

    // Open Reorder List Modal
    const handleOpenReorderModal = () => {
        setShowReorderModal(true);
    };

    // Close Modals
    const handleCloseModals = () => {
        setShowProductModal(false);
        setShowReorderModal(false);
    };

    // Download Order List as PDF
    const handleDownloadPDF = () => {
        const doc = new jsPDF();
        doc.text("Reorder List", 10, 10);
        reorderList.forEach((product, index) => {
            doc.text(`${index + 1}. ${product.productName} - SKU: ${product.sku} - Quantity: ${product.quantity}`, 10, 20 + index * 10);
        });
        doc.save("Reorder_List.pdf");
    };

    // Save the reorder list to Firebase
    const handleSaveOrderToFirebase = async () => {
        try {
            const orderDetails = reorderList.map((product) => ({
                barcode: product.barcode,
                productName: product.productName,
                sku: product.sku,
                quantity: product.quantity,
                date: new Date().toISOString(),
            }));

            // Save the order details to Firebase
            await saveOrderToFirebase({ orderDetails });

            alert("Order saved successfully to Firebase!");

            // Fetch the updated saved orders after saving
            const orders = await fetchSavedOrders();  // Re-fetch saved orders to update the list
            setSavedOrders(orders);

            // Clear reorder list after saving
            setReorderList([]);
            localStorage.removeItem('reorderList'); // Clear from localStorage
        } catch (error) {
            console.error("Error saving order to Firebase:", error);
            alert("Error saving order!");
        }
    };

    // Filter out reordered products from the list
    const filteredReorderingProducts = reorderingProducts.filter(product => !reorderedProducts.has(product.barcode));

    return (
        <Container>
            <h4 className="my-4">Reordering Dashboard</h4>
            {loading ? (
                <Spinner animation="border" variant="primary" />
            ) : (
                <>
                    {filteredReorderingProducts.length > 0 ? (
                        <Table responsive bordered hover className="mt-3">
                            <thead className="table-primary">
                                <tr>
                                    <th>Product Name</th>
                                    <th>SKU</th>
                                    <th>Category</th>
                                    <th>Quantity</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredReorderingProducts.map((product) => {
                                    const isOutOfStock = product.quantity === 0;
                                    const isLowStock = product.quantity > 0 && product.quantity <= product.instockthreshold / 4;

                                    const statusBadge = isOutOfStock ? (
                                        <Badge bg="danger">Out of Stock</Badge>
                                    ) : (
                                        isLowStock && <Badge bg="warning">Low Stock</Badge>
                                    );

                                    if (!isOutOfStock && !isLowStock) return null;

                                    return (
                                        <tr key={product.barcode}>
                                            <td>{product.productName}</td>
                                            <td>{product.sku}</td>
                                            <td>{product.category}</td>
                                            <td>{product.quantity}</td>
                                            <td>{statusBadge}</td>
                                            <td>
                                                <Button
                                                    variant="success"
                                                    size="sm"
                                                    onClick={() => handleViewProduct(product)}
                                                >
                                                    Reorder
                                                </Button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </Table>
                    ) : (
                        <p className="text-muted">No products need reordering.</p>
                    )}
                    <Button variant="primary" onClick={handleOpenReorderModal} className="mt-3">
                        View Reordered Products
                    </Button>

                    {/* Pending Orders Section */}
                    <h4 className="my-4">Pending Orders</h4>
                    {reorderList.length > 0 ? (
                        <Table bordered hover>
                            <thead className="table-primary">
                                <tr>
                                    <th>Product Name</th>
                                    <th>SKU</th>
                                    <th>Quantity</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reorderList.map((product) => (
                                    <tr key={product.barcode}>
                                        <td>{product.productName}</td>
                                        <td>{product.sku}</td>
                                        <td>{product.quantity}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    ) : (
                        <p>No pending orders.</p>
                    )}

                    {/* Saved Orders Section */}
                    <h4 className="my-4">Saved Orders</h4>
                    {savedOrders.length > 0 ? (
                        <Table bordered hover>
                            <thead className="table-primary">
                                <tr>
                                    <th>Order Date</th>
                                    <th>Product Name</th>
                                    <th>SKU</th>
                                    <th>Quantity</th>
                                </tr>
                            </thead>
                            <tbody>
                                {savedOrders.map((order, index) => (
                                    <tr key={index}>
                                        <td>{new Date(order.date).toLocaleDateString()}</td>
                                        <td>{order.productName}</td>
                                        <td>{order.sku}</td>
                                        <td>{order.quantity}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    ) : (
                        <p>No saved orders.</p>
                    )}
                </>
            )}

            {/* Product Details Modal */}
            <Modal show={showProductModal} onHide={handleCloseModals}>
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
                    <Button variant="secondary" onClick={handleCloseModals}>
                        Close
                    </Button>
                    <Button variant="success" onClick={() => handleReorderProduct(selectedProduct)}>
                        Add to Reorder List
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Reorder List Modal */}
            <Modal show={showReorderModal} onHide={handleCloseModals}>
                <Modal.Header closeButton>
                    <Modal.Title>Reorder List</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {reorderList.length > 0 ? (
                        <Table bordered>
                            <thead>
                                <tr>
                                    <th>Product Name</th>
                                    <th>SKU</th>
                                    <th>Quantity</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reorderList.map((product) => (
                                    <tr key={product.barcode}>
                                        <td>{product.productName}</td>
                                        <td>{product.sku}</td>
                                        <td>{product.quantity}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    ) : (
                        <p>No products added to reorder list.</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModals}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleDownloadPDF}>
                        Download PDF
                    </Button>
                    <Button variant="success" onClick={handleSaveOrderToFirebase}>
                        Save Order
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default ReOrdering;
