import React, { useEffect, useState } from "react";
import { Modal, Button, Spinner, Alert, Table } from "react-bootstrap";
import { fetchSavedOrders, deleteSavedOrder } from "../../../services/ProductService"; // Assuming you have a delete function in the service
import jsPDF from "jspdf";
import { LuDownload } from "react-icons/lu";
import { GrView } from "react-icons/gr";

function SavedOrderDetails() {
    const [savedOrders, setSavedOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [expandedOrders, setExpandedOrders] = useState({}); // Track expanded state of each order

    // Fetch saved order details
    const fetchOrders = async () => {
        try {
            const orders = await fetchSavedOrders();
            setSavedOrders(orders);
        } catch (error) {
            setError("Error fetching saved orders.");
            console.error("Error fetching saved orders:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (showModal) {
            setLoading(true);
            setError(null);
            fetchOrders();
        }
    }, [showModal]);

    // Handle modal close
    const handleCloseModal = () => setShowModal(false);

    // Toggle product list visibility
    const toggleShowMore = (orderId) => {
        setExpandedOrders((prevState) => ({
            ...prevState,
            [orderId]: !prevState[orderId],
        }));
    };

    // Generate PDF for the order
    const downloadPDF = (order) => {
        const doc = new jsPDF();
        doc.text(`Order ID: ${order.id}`, 10, 10);
        doc.text(`Order Date: ${new Date(order.date).toLocaleDateString()}`, 10, 20);

        let y = 30; // Starting Y position for products

        order.products.forEach((product, index) => {
            doc.text(`Product ${index + 1}:`, 10, y);
            doc.text(`Name: ${product.productName || "No Name"}`, 20, y + 10);
            doc.text(`SKU: ${product.sku || "N/A"}`, 20, y + 20);
            doc.text(`Quantity: ${product.quantity || "0"}`, 20, y + 30);
            y += 40; // Adjust space between products
        });

        doc.save(`${order.id}_order.pdf`);
    };

    // Delete an order
    const handleDeleteOrder = async (orderId) => {
        try {
            await deleteSavedOrder(orderId); // Assuming you have a delete function in your service
            setSavedOrders((prevOrders) => prevOrders.filter(order => order.id !== orderId));
            alert('Order deleted successfully!');
        } catch (error) {
            setError("Error deleting order.");
            alert('Failed to delete order: ' + error.message);
        }
    };

    return (
        <div style={{display: "flex", alignItems: "flex-end"}}>
            <Button variant="primary" onClick={() => setShowModal(true)}>
                <GrView size={17} className="me-2"/>View Saved Orders
            </Button>

            {/* Saved Orders Modal */}
            <Modal show={showModal} onHide={handleCloseModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Saved Order Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {loading ? (
                        <div className="text-center">
                            <Spinner animation="border" variant="primary" />
                            <p>Loading...</p>
                        </div>
                    ) : error ? (
                        <Alert variant="danger">{error}</Alert>
                    ) : (
                        <div>
                            {savedOrders.length > 0 ? (
                                <Table bordered hover responsive>
                                    <thead className="table-primary">
                                        <tr>
                                            <th>Order ID</th>
                                            <th>Order Date</th>
                                            <th>Products</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {savedOrders.map((order, index) => (
                                            <React.Fragment key={index}>
                                                <tr>
                                                    <td>{order.id || "No ID"}</td>
                                                    <td>{new Date(order.date).toLocaleDateString()}</td>
                                                    <td>
                                                        {order.products && order.products.length > 0
                                                            ? `${order.products.length} Product(s)`
                                                            : "No products"}
                                                    </td>
                                                    <td>
                                                        <Button
                                                            variant="light"
                                                            onClick={() => toggleShowMore(order.id)}
                                                            aria-expanded={expandedOrders[order.id]}
                                                            className="p-0"
                                                        >
                                                            {expandedOrders[order.id] ? "Hide" : "Show More"}{" "}
                                                        </Button>
                                                        <Button
                                                            variant="light"
                                                            onClick={() => downloadPDF(order)}
                                                            className="ml-2 p-0"
                                                        >
                                                            <LuDownload size={20} />
                                                        </Button>
                                                        <Button
                                                            variant="danger"
                                                            onClick={() => handleDeleteOrder(order.id)}
                                                            className="ml-2 p-0"
                                                        >
                                                            Delete
                                                        </Button>
                                                    </td>
                                                </tr>
                                                {expandedOrders[order.id] && (
                                                    <tr>
                                                        <td colSpan="4">
                                                            <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                                                                <strong>Products:</strong>
                                                                <Table bordered hover responsive size="sm">
                                                                    <thead>
                                                                        <tr>
                                                                            <th>Product Name</th>
                                                                            <th>SKU</th>
                                                                            <th>Quantity</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {order.products.map((product, pIndex) => (
                                                                            <tr key={pIndex}>
                                                                                <td>{product.productName || "No Name"}</td>
                                                                                <td>{product.sku || "N/A"}</td>
                                                                                <td>{product.quantity || "0"}</td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </Table>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </tbody>
                                </Table>
                            ) : (
                                <p>No saved orders found.</p>
                            )}
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default SavedOrderDetails;
