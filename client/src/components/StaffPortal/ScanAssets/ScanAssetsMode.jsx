import { Container, Navbar, Row, Col, Button, Table, Alert } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { updateProductQuantity } from '../../../services/ProductService';
import { useState } from 'react';

function Checkout() {
    const location = useLocation();
    const navigate = useNavigate();
    const scannedItems = location.state?.scannedItems || [];
    const [errorMessage, setErrorMessage] = useState("");
    const currentDate = new Date().toLocaleString(); // Get current date and time

    const handleFinalizeCheckout = async () => {
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

    const handleSaveOrder = () => {
        const orderDetails = {
            date: currentDate,
            items: scannedItems,
            total: scannedItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
        };

        // Store the order in local storage (or you could use a database)
        const orderHistory = JSON.parse(localStorage.getItem('TransactionHistory')) || [];
        orderHistory.push(orderDetails);
        localStorage.setItem('TransactionHistory', JSON.stringify(orderHistory));

        alert('Order saved successfully!');
    };

    const handleViewTransactionHistory = () => {
        navigate('/TransactionHistory'); // Adjust this path based on your routing setup
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
                        <p>Date: {currentDate}</p>
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
                                {scannedItems.length > 0 ? (
                                    scannedItems.map(item => (
                                        <tr key={item.productId}>
                                            <td>{item.productName}</td>
                                            <td>{item.quantity}</td>
                                            <td>${Number(item.price).toFixed(2)}</td>
                                            <td>${(item.price * item.quantity).toFixed(2)}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="text-center">No items in the cart</td>
                                    </tr>
                                )}
                                {scannedItems.length > 0 && (
                                    <tr>
                                        <td colSpan="3" className="text-end"><strong>Grand Total:</strong></td>
                                        <td>${(scannedItems.reduce((acc, item) => acc + item.price * item.quantity, 0)).toFixed(2)}</td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
                {scannedItems.length > 0 && (
                    <Row className="mt-3">
                        <Col className="text-end">
                            <Button variant="success" onClick={handleFinalizeCheckout}>Finalize Checkout</Button>
                            <Button variant="secondary" className="ms-2" onClick={handleSaveOrder}>Save Order</Button>
                        </Col>
                    </Row>
                )}
            </Container>
        </Container>
    );
}

export default Checkout;
