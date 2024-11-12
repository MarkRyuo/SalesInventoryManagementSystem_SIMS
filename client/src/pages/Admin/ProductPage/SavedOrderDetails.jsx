import { useEffect, useState } from "react";
import { Modal, Button, Spinner, Alert, Card } from "react-bootstrap";
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
                        <div className="horizontal-scroll-container">
                            {savedOrders.length > 0 ? (
                                <div style={{ display: "flex", gap: "15px", overflowX: "auto", padding: "10px" }}>
                                    {savedOrders.map((order, index) => (
                                        <Card
                                            key={index}
                                            border="primary"
                                            style={{
                                                minWidth: "300px",
                                                flex: "0 0 auto",
                                                marginBottom: "15px",
                                            }}
                                        >
                                            <Card.Body>
                                                <Card.Title>Order ID: {order.id || "No ID"}</Card.Title>
                                                <Card.Subtitle className="mb-2 text-muted">
                                                    <strong>Order Date:</strong> {new Date(order.date).toLocaleDateString()}
                                                </Card.Subtitle>
                                                <Card.Text>
                                                    <strong>Total Quantity:</strong> {order.totalQuantity || "0"}
                                                </Card.Text>
                                                <Button
                                                    variant="link"
                                                    onClick={() => toggleShowMore(order.id)}
                                                    aria-expanded={expandedOrders[order.id]}
                                                >
                                                    {expandedOrders[order.id] ? "Show Less" : "Show More"}
                                                </Button>

                                                {/* Product List (Toggled by "Show More" button) */}
                                                {expandedOrders[order.id] && (
                                                    <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                                                        <strong>Products:</strong>
                                                        {order.products && order.products.length > 0 ? (
                                                            <ul className="list-unstyled">
                                                                {order.products.map((product, pIndex) => (
                                                                    <li key={pIndex}>
                                                                        <strong>Product Name:</strong> {product.productName || "No Name"}
                                                                        <br />
                                                                        <strong>SKU:</strong> {product.sku || "N/A"}
                                                                        <br />
                                                                        <strong>Quantity:</strong> {product.quantity || "0"}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        ) : (
                                                            <p>No products found in this order.</p>
                                                        )}
                                                    </div>
                                                )}
                                            </Card.Body>
                                        </Card>
                                    ))}
                                </div>
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
