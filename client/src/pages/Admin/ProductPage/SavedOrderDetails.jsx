import { useEffect, useState } from "react";
import { Modal, Button, Spinner, Alert, Card, Row, Col } from "react-bootstrap";
import { fetchSavedOrders } from "../../../services/ProductService"; // Assuming fetchSavedOrders is a service function

function SavedOrderDetails() {
    const [savedOrders, setSavedOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // New state for error handling
    const [showModal, setShowModal] = useState(false);

    // Fetch saved order details
    const fetchOrders = async () => {
        try {
            const orders = await fetchSavedOrders();  // Fetch saved orders from Firebase or API
            setSavedOrders(orders);
        } catch (error) {
            setError("Error fetching saved orders.");  // Set error message if fetch fails
            console.error("Error fetching saved orders:", error);
        } finally {
            setLoading(false); // Stop loading spinner when done
        }
    };

    useEffect(() => {
        if (showModal) {
            setLoading(true);
            setError(null); // Reset error on modal open
            fetchOrders();
        }
    }, [showModal]);

    // Handle modal close
    const handleCloseModal = () => setShowModal(false);

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
                        <Alert variant="danger">{error}</Alert> // Show error message
                    ) : (
                        <Row>
                                    {savedOrders.length > 0 ? (
                                        savedOrders.map((order, index) => (
                                            <Col key={index} xs={12} md={6} lg={4} className="mb-3">
                                                <Card border="primary">
                                                    <Card.Body>
                                                        <Card.Title>{order.productName || 'No Name'}</Card.Title>
                                                        <Card.Subtitle className="mb-2 text-muted">SKU: {order.sku || 'N/A'}</Card.Subtitle>
                                                        <Card.Text>
                                                            <strong>Order Date:</strong> {new Date(order.date).toLocaleDateString()}
                                                        </Card.Text>
                                                        <Card.Text>
                                                            <strong>Quantity:</strong> {order.quantity || '0'}
                                                        </Card.Text>
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                        ))
                                    ) : (
                                        <p>No saved orders found.</p>
                                    )}

                        </Row>
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
