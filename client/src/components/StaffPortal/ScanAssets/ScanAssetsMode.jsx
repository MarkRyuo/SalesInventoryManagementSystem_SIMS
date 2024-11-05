import { Container, Navbar, Row, Col, Button, Table, Alert, Form } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { updateProductQuantity } from '../../../services/ProductService';
import { useState } from 'react';
import { getDatabase, ref, set } from 'firebase/database';

function Checkout() {
    const location = useLocation();
    const navigate = useNavigate();
    const scannedItems = location.state?.scannedItems || [];
    const [errorMessage, setErrorMessage] = useState("");
    const currentDate = new Date().toLocaleString();
    const [customerName, setCustomerName] = useState("John Doe");  // Editable customer name

    const taxRate = 0.12;  // 12% tax rate
    const discount = 100;  // Fixed discount of 100

    // Calculations
    const subtotal = scannedItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const tax = subtotal * taxRate;
    const total = subtotal + tax - discount;

    const handleCheckout = async () => {
        if (!customerName.trim()) {
            setErrorMessage("Customer name is required.");
            return;
        }

        const zeroQuantityItem = scannedItems.find(item => item.quantity <= 0);
        if (zeroQuantityItem) {
            setErrorMessage(`Cannot proceed to checkout. ${zeroQuantityItem.productName} has a quantity of zero.`);
            return;
        }

        const orderDetails = {
            date: currentDate,
            customerName,
            items: scannedItems,
            subtotal,
            tax,
            discount,
            total
        };

        const db = getDatabase();
        const newOrderRef = ref(db, 'TransactionHistory/' + Date.now());
        await set(newOrderRef, orderDetails);

        const updatePromises = scannedItems.map(item => updateProductQuantity(item.barcode, -item.quantity));

        try {
            await Promise.all(updatePromises);
            alert('Order saved successfully!');
            navigate('/PosSuccess');
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
                        <p>Date: {currentDate}</p>
                        <Form.Group controlId="customerName">
                            <Form.Label>Sold To:</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter customer name"
                                value={customerName}
                                onChange={(e) => setCustomerName(e.target.value)}
                            />
                        </Form.Group>
                        <Table striped bordered hover className="mt-3">
                            <thead>
                                <tr>
                                    <th>Description (Product Name, Size, Color, Voltage, Watt)</th>
                                    <th>Quantity</th>
                                    <th>Unit Price</th>
                                    <th>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {scannedItems.length > 0 ? (
                                    scannedItems.map(item => (
                                        <tr key={item.productId}>
                                            <td>
                                                {item.productName}
                                                {item.size && `, Size: ${item.size}`}
                                                {item.color && `, Color: ${item.color}`}
                                                {item.voltage && `, Voltage: ${item.voltage}`}
                                                {item.watt && `, Watt: ${item.watt}`}
                                            </td>
                                            <td>{item.quantity}</td>
                                            <td>₱{Number(item.price).toFixed(2)}</td>
                                            <td>₱{(item.price * item.quantity).toFixed(2)}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="text-center">No items in the cart</td>
                                    </tr>
                                )}
                                {scannedItems.length > 0 && (
                                    <>
                                        <tr>
                                            <td colSpan="3" className="text-end"><strong>Subtotal:</strong></td>
                                            <td>₱{subtotal.toFixed(2)}</td>
                                        </tr>
                                        <tr>
                                            <td colSpan="3" className="text-end"><strong>Tax (12%):</strong></td>
                                            <td>₱{tax.toFixed(2)}</td>
                                        </tr>
                                        <tr>
                                            <td colSpan="3" className="text-end"><strong>Discount:</strong></td>
                                            <td>-₱{discount.toFixed(2)}</td>
                                        </tr>
                                        <tr>
                                            <td colSpan="3" className="text-end"><strong>Total:</strong></td>
                                            <td>₱{total.toFixed(2)}</td>
                                        </tr>
                                    </>
                                )}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
                {scannedItems.length > 0 && (
                    <Row className="mt-3">
                        <Col className="text-end">
                            <Button variant="success" onClick={handleCheckout}>Finalize Checkout</Button>
                        </Col>
                    </Row>
                )}
            </Container>
        </Container>
    );
}

export default Checkout;
