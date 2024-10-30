import { Container, Navbar, Row, Col, Button } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { updateProductQuantity } from '../../../services/ProductService';

function Checkout() {
    const location = useLocation();
    const navigate = useNavigate();
    const scannedItems = location.state?.scannedItems || [];

    const handleFinalizeCheckout = async () => {
        // Deduct quantities from the inventory
        const updatePromises = scannedItems.map(item => {
            return updateProductQuantity(item.barcode, -item.quantity);
        });

        try {
            await Promise.all(updatePromises); // Wait for all updates to complete
            // Optionally, you could navigate to a confirmation page or show a success message
            navigate('/PosSuccess'); // Example: navigate to a confirmation page
        } catch (error) {
            console.error("Error updating product quantities:", error);
            // Optionally, show an error message to the user
        }
    };

    return (
        <Container fluid className="m-0 p-0">
            <Navbar className="bg-body-tertiary">
                <Container>
                    <p className="fs-4 m-0">Checkout</p>
                </Container>
            </Navbar>
            <Container fluid='md' className="mt-3">
                <Row>
                    <Col>
                        <h4>Your Order</h4>
                        {scannedItems.length > 0 ? (
                            scannedItems.map(item => (
                                <Row key={item.productId}>
                                    <Col>{item.productName}</Col>
                                    <Col>{item.quantity}</Col>
                                    <Col>${Number(item.price).toFixed(2)}</Col>
                                    <Col>${(item.price * item.quantity).toFixed(2)}</Col>
                                </Row>
                            ))
                        ) : (
                            <h4>No items in the cart</h4>
                        )}
                    </Col>
                </Row>
                {scannedItems.length > 0 && (
                    <Row className="mt-3">
                        <Col className="text-end">
                            <Button variant="success" onClick={handleFinalizeCheckout}>Finalize Checkout</Button>
                        </Col>
                    </Row>
                )}
            </Container>
        </Container>
    );
}

export default Checkout;
