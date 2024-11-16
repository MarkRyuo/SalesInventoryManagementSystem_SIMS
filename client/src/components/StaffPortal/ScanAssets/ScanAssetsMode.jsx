import { Container, Navbar, Row, Col, Button, Table, Alert, Form } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { updateProductQuantity, fetchAllDiscounts, fetchAllTaxes } from '../../../services/ProductService';
import { useState, useEffect } from 'react';
import { getDatabase, ref, set } from 'firebase/database';

function Checkout() {
    const location = useLocation();
    const navigate = useNavigate();
    const scannedItems = location.state?.scannedItems || [];
    const [errorMessage, setErrorMessage] = useState("");
    const currentDate = new Date().toLocaleString();
    const [customerName, setCustomerName] = useState("Customer name (Optional)");

    const [availableDiscounts, setAvailableDiscounts] = useState([]);
    const [selectedDiscount, setSelectedDiscount] = useState(0);
    const [availableTaxes, setAvailableTaxes] = useState([]);
    const [selectedTaxRate, setSelectedTaxRate] = useState(0);
    

    // Load available discounts and taxes
    useEffect(() => {
        const loadDiscountsAndTaxes = async () => {
            try {
                const discounts = await fetchAllDiscounts();
                setAvailableDiscounts(discounts);

                const taxes = await fetchAllTaxes();
                setAvailableTaxes(taxes);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        loadDiscountsAndTaxes();
    }, []);

    // Handle discount change
    const handleDiscountChange = (value) => {
        setSelectedDiscount(parseFloat(value));
    };

    // Handle global tax rate change
    const handleGlobalTaxChange = (value) => {
        setSelectedTaxRate(parseFloat(value));
    };

    // Calculate subtotal before using it in other calculations
    const subtotal = scannedItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    // Discount calculation as percentage of subtotal
    const discountPercentage = selectedDiscount; // The percentage selected from the dropdown
    const discountAmount = (subtotal * discountPercentage) / 100; // Calculate the discount amount based on the subtotal
    // Tax calculation after applying the discount
    const taxAmount = ((subtotal - discountAmount) * selectedTaxRate) / 100;
    const total = subtotal + taxAmount - discountAmount; // Final total after discount and tax

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
            subtotal, // Make sure the subtotal is included here
            tax: taxAmount,
            discount: discountAmount, // Pass the calculated discount amount
            discountPercentage, // Pass the discount percentage
            total,
        };


        const db = getDatabase();
        const newOrderRef = ref(db, 'TransactionHistory/' + Date.now());
        await set(newOrderRef, orderDetails);

        try {
            await Promise.all(scannedItems.map(item => updateProductQuantity(item.barcode, -item.quantity)));
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
                                placeholder="Enter customer name (Optional)"
                                value={customerName}
                                onChange={(e) => setCustomerName(e.target.value)}
                            />
                        </Form.Group>

                        {/* Discount Dropdown */}
                        <Form.Group className="mt-3">
                            <Form.Label>Discount:</Form.Label>
                            <Form.Select
                                size="sm"
                                value={selectedDiscount}
                                onChange={(e) => handleDiscountChange(e.target.value)}
                            >
                                <option value={0}>No Discount</option>
                                {availableDiscounts.map((discount) => (
                                    <option key={discount.id} value={discount.value}>
                                        {discount.name} - {discount.value}%
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>


                        {/* Global Tax Dropdown */}
                        <Form.Group className="mt-3">
                            <Form.Label>Tax Rate:</Form.Label>
                            <Form.Select
                                size="sm"
                                value={selectedTaxRate}
                                onChange={(e) => handleGlobalTaxChange(e.target.value)}
                            >
                                <option value={0}>No Tax</option>
                                {availableTaxes.map(tax => (
                                    <option key={tax.id} value={tax.value}>
                                        {tax.name} - {tax.value}%
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Table striped bordered hover className="mt-3">
                            <thead>
                                <tr>
                                    <th>Description</th>
                                    <th>Quantity</th>
                                    <th>Unit Price</th>
                                    <th>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {scannedItems.map(item => (
                                    <tr key={item.productId}>
                                        <td>{item.productName}</td>
                                        <td>{item.quantity}</td>
                                        <td>₱{item.price.toFixed(2)}</td>
                                        <td>₱{(item.price * item.quantity).toFixed(2)}</td>
                                    </tr>
                                ))}
                                <tr>
                                    <td colSpan="3" className="text-end"><strong>Subtotal:</strong></td>
                                    <td>₱{subtotal.toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <td colSpan="3" className="text-end"><strong>Discount ({discountPercentage}%):</strong></td>
                                    <td>-₱{discountAmount.toFixed(2)}</td>
                                </tr>

                                <tr>
                                    <td colSpan="3" className="text-end"><strong>Total Tax:</strong></td>
                                    <td>₱{taxAmount.toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <td colSpan="3" className="text-end"><strong>Total:</strong></td>
                                    <td>₱{total.toFixed(2)}</td>
                                </tr>
                            </tbody>
                        </Table>
                        <Button variant="success" onClick={handleCheckout}>Finalize Checkout</Button>
                    </Col>
                </Row>
            </Container>
        </Container>
    );
}

export default Checkout;
