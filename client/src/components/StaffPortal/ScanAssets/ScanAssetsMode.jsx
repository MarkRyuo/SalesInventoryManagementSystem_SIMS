import { Container, Row, Col, Card, Button, ListGroup, Alert } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';

function ScanAssetsMode() {
    const location = useLocation();
    const navigate = useNavigate();
    const currentOrders = location.state?.currentOrders || []; // Get current orders from location state
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    // Function to handle finalizing the order
    const handleFinalizeClick = async () => {
        // Implement your order finalization logic here
        try {
            // Placeholder for actual order finalization logic
            // await finalizeOrder(currentOrders);
            setSuccessMessage("Order finalized successfully!");
            setError(null);
            navigate("/someOtherPage"); // Navigate to another page after finalizing
        } catch (err) {
            setError("Error finalizing the order. Please try again.");
            setSuccessMessage(null);
        }
    };

    return (
        <Container fluid>
            <Row className="justify-content-center mt-3">
                <Col md={8}>
                    <Card>
                        <Card.Header className="text-center">
                            <h4>Current Orders</h4>
                        </Card.Header>
                        <Card.Body>
                            {error && <Alert variant="danger">{error}</Alert>}
                            {successMessage && <Alert variant="success">{successMessage}</Alert>}

                            <ListGroup>
                                {currentOrders.length === 0 ? (
                                    <ListGroup.Item>No items in the current orders.</ListGroup.Item>
                                ) : (
                                    currentOrders.map((item, index) => (
                                        <ListGroup.Item key={index}>
                                            <Row>
                                                <Col md={6}>{item.productName}</Col>
                                                <Col md={4}>Quantity: {item.quantity}</Col>
                                                <Col md={2}>
                                                    <Button variant="danger" size="sm" onClick={() => handleRemoveItem(index)}>
                                                        Remove
                                                    </Button>
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>
                                    ))
                                )}
                            </ListGroup>
                        </Card.Body>
                        <Card.Footer className="text-center">
                            <Button
                                variant="primary"
                                onClick={handleFinalizeClick}
                                disabled={currentOrders.length === 0} // Disable button if there are no orders
                            >
                                Finalize Order
                            </Button>
                        </Card.Footer>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default ScanAssetsMode;
