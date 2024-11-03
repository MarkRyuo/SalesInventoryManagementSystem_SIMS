import { Container, Navbar, Row, Col, Button, Table, Alert } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { updateProductQuantity } from '../../../services/ProductService';
import { useState } from 'react';

function Checkout() {
    const location = useLocation();
    const navigate = useNavigate();
    const scannedItems = location.state?.scannedItems || [];
    const [errorMessage, setErrorMessage] = useState("");

    const handleFinalizeCheckout = async () => {
        // Deduct quantities from the inventory
        const updatePromises = scannedItems.map(item => {
            return updateProductQuantity(item.barcode, -item.quantity);
        });

        try {
            await Promise.all(updatePromises); // Wait for all updates to complete
            navigate('/PosSuccess'); // Navigate to a confirmation page
        } catch (error) {
            console.error("Error updating product quantities:", error);
            setErrorMessage("Failed to finalize checkout. Please try again.");
        }
    };

    return (
        <Container fluid className="m-0 p-0">
            <Navbar className="bg-light shadow-sm">
                <Container>
                    <Navbar.Brand className="fs-4">Checkout</Navbar.Brand>
                </Container>
            </Navbar>
            <Container fluid='lg' className="mt-3">
                {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
                <Row>
                    <Col>
                        <h4>Your Order</h4>
                        {scannedItems.length > 0 ? (
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Product Name</th>
                                        <th>Quantity</th>
                                        <th>Unit Price</th>
                                        <th>Total Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {scannedItems.map(item => (
                                        <tr key={item.productId}>
                                            <td>{item.productName}</td>
                                            <td>{item.quantity}</td>
                                            <td>${Number(item.price).toFixed(2)}</td>
                                            <td>${(item.price * item.quantity).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                    <tr>
                                        <td colSpan="3" className="text-end"><strong>Grand Total:</strong></td>
                                        <td>${(scannedItems.reduce((acc, item) => acc + item.price * item.quantity, 0)).toFixed(2)}</td>
                                    </tr>
                                </tbody>
                            </Table>
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
