import React from "react";
import { useEffect, useState } from "react";
import { Modal, Button, Spinner, Alert, Table } from "react-bootstrap";
import { fetchSavedOrders } from "../../../services/ProductService";

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

    return (
        <>
            <Button variant="primary" onClick={() => setShowModal(true)}>
                View Saved Orders
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
                                                            variant="link"
                                                            onClick={() => toggleShowMore(order.id)}
                                                            aria-expanded={expandedOrders[order.id]}
                                                        >
                                                            {expandedOrders[order.id] ? "Show Less" : "Show More"}
                                                        </Button>
                                                    </td>
                                                </tr>
                                                {expandedOrders[order.id] && (
                                                    <tr>
                                                        <td colSpan="4">
                                                            <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                                                                <strong>Products:</strong>
                                                                {order.products && order.products.length > 0 ? (
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
                                                                ) : (
                                                                    <p>No products found for this order.</p>
                                                                )}
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
        </>
    );
}

export default SavedOrderDetails;
