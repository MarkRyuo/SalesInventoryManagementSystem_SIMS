import { Container, Navbar, Row, Col, Button, Table, Alert, Form } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { updateProductQuantity, fetchAllDiscounts} from '../../../services/ProductService';
import { useState } from 'react';
import { getDatabase, ref, set } from 'firebase/database';
import { useEffect } from "react";

function Checkout() {
    const location = useLocation();
    const navigate = useNavigate();
    const scannedItems = location.state?.scannedItems || [];
    const [errorMessage, setErrorMessage] = useState("");
    const currentDate = new Date().toLocaleString();
    const [customerName, setCustomerName] = useState("Enter the customer name (Optional)");  // Editable customer name
    const [availableDiscounts, setAvailableDiscounts] = useState([]);
    const [selectedDiscount, setSelectedDiscount] = useState(0);

    // Updated Calculations
    const discount = selectedDiscount; // Gumamit ng selected discount value
    
    
    // Calculations
    const subtotal = scannedItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    
    // Calculate tax based on each product's tax property
    const totalTax = scannedItems.reduce((acc, item) => {
        const itemTax = (item.price * item.quantity * (typeof item.tax === 'number' ? (item.tax / 100) : 0)); 
        return acc + itemTax;
    }, 0);
    
    const total = subtotal + totalTax - discount;

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
            tax: totalTax,
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

    useEffect(() => {
        const loadDiscounts = async () => {
            try {
                const discounts = await fetchAllDiscounts();
                setAvailableDiscounts(discounts);
            } catch (error) {
                console.error("Error fetching discounts:", error);
            }
        };

        loadDiscounts();
    }, []);

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
                                    <th>Tax Rate</th>
                                    <th>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {scannedItems.length > 0 ? (
                                    scannedItems.map(item => {
                                        const itemTotal = item.price * item.quantity;
                                        // Apply the new formula with a fallback for undefined tax rate
                                        const itemTax = (item.price * item.quantity * (item.tax || 0)) / 100; // Default to 0 if item.tax is undefined
                                        const itemAmountWithTax = itemTotal + itemTax;

                                        return (
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
                                                <td>{(item.tax || 0).toFixed(2)}%</td> {/* Show 0% if no tax is defined */}
                                                <td>₱{itemAmountWithTax.toFixed(2)}</td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center">No items in the cart</td>
                                    </tr>
                                )}
                                {scannedItems.length > 0 && (
                                    <>
                                        <tr>
                                            <td colSpan="4" className="text-end"><strong>Subtotal:</strong></td>
                                            <td>₱{subtotal.toFixed(2)}</td>
                                        </tr>
                                        <tr>
                                            <td colSpan="4" className="text-end"><strong>Total Tax:</strong></td>
                                            <td>₱{totalTax.toFixed(2)}</td>
                                        </tr>
                                        <tr>
                                            <td colSpan="4" className="text-end">
                                                <div className="d-flex justify-content-end align-items-center">
                                                    <strong>Discount ({discount ? `${discount.toFixed(2)}` : '0.00'}):</strong>
                                                    <Form.Group className="mb-0 d-flex align-items-center">
                                                        <Form.Select
                                                            size="sm"
                                                            className="form-select-sm"
                                                            value={selectedDiscount}
                                                            onChange={(e) => setSelectedDiscount(parseFloat(e.target.value))}
                                                            style={{ maxWidth: '150px' }} // Limit width if needed
                                                        >
                                                            <option value={0}>No Discount</option>
                                                            {availableDiscounts.map((discount) => (
                                                                <option key={discount.id} value={discount.value}>
                                                                    {discount.name} - ₱{discount.value.toFixed(2)}
                                                                </option>
                                                            ))}
                                                        </Form.Select>
                                                    </Form.Group>
                                                </div>
                                            </td>


                                            <td>-₱{discount.toFixed(2)}</td>
                                        </tr>

                                        <tr>
                                            <td colSpan="4" className="text-end"><strong>Total:</strong></td>
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
