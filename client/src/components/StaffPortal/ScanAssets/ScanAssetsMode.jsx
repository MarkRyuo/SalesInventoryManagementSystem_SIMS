import { Container, Row, Col, Button, Table, Alert, Form } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { updateProductQuantity, fetchAllDiscounts, fetchAllTaxes, saveTransactionHistory } from '../../../services/ProductService';
import { useState, useEffect } from 'react';
import ScanProductModeScss from './PosScanner.module.scss' ;

function Checkout() {
    const location = useLocation();
    const navigate = useNavigate();
    const scannedItems = location.state?.scannedItems || [];
    const [errorMessage, setErrorMessage] = useState("");
    const currentDate = new Date().toLocaleString();
    const [customerName, setCustomerName] = useState("");
    const [paymentAmount, setPaymentAmount] = useState(""); // New state for payment amount
    const [change, setChange] = useState(0); // New state for change

    const [availableDiscounts, setAvailableDiscounts] = useState([]);
    const [selectedDiscount, setSelectedDiscount] = useState(0);
    const [availableTaxes, setAvailableTaxes] = useState([]);
    const [selectedTaxRate, setSelectedTaxRate] = useState(0);

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

    const handleDiscountChange = (value) => {
        setSelectedDiscount(parseFloat(value));
    };

    const handleGlobalTaxChange = (value) => {
        setSelectedTaxRate(parseFloat(value));
    };

    const subtotal = scannedItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const discountPercentage = selectedDiscount;
    const discountAmount = (subtotal * discountPercentage) / 100;
    const taxAmount = ((subtotal - discountAmount) * selectedTaxRate) / 100;
    const total = subtotal + taxAmount - discountAmount;

    const totalQuantity = scannedItems.reduce((acc, item) => acc + item.quantity, 0);

    // Function to calculate change
    const handlePaymentChange = (e) => {
        const payment = parseFloat(e.target.value);
        setPaymentAmount(payment || "");
        if (payment >= total) {
            setChange(payment - total);
        } else {
            setChange(0);
        }
    };

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

        const insufficientStockItem = scannedItems.find(item => item.quantity > item.stockNumber);
        if (insufficientStockItem) {
            setErrorMessage(`Insufficient stock for ${insufficientStockItem.productName}.`);
            return;
        }

        const missingProductIdItem = scannedItems.find(item => !item.productId);
        if (missingProductIdItem) {
            setErrorMessage(`Missing productId for item: ${missingProductIdItem.productName}`);
            return;
        }

        const orderDetails = {
            date: currentDate,
            customerName,
            items: scannedItems.map(item => ({
                productId: item.productId,
                productName: item.productName,
                quantity: item.quantity,
                price: item.price,
                totalAmount: (item.price * item.quantity).toFixed(2),
            })),
            subtotal: subtotal.toFixed(2),
            tax: taxAmount.toFixed(2),
            discount: discountAmount.toFixed(2),
            discountPercentage,
            total: total.toFixed(2),
            totalQuantity,
            paymentAmount: paymentAmount.toFixed(2),  // Add payment amount
            change: change.toFixed(2),  // Add change
        };

        try {
            await saveTransactionHistory(orderDetails);  // Save transaction with new fields
            console.log("Transaction saved successfully");
        } catch (error) {
            setErrorMessage(`Failed to save transaction. ${error.message}`);
            return;
        }

        try {
            await Promise.all(
                scannedItems.map(async (item) => {
                    await updateProductQuantity(item.barcode, -item.quantity); // Update stock
                })
            );
            navigate('/PosSuccess');  // Redirect to success page
        } catch (error) {
            setErrorMessage(`Failed to finalize checkout. ${error.message}`);
        }
    };


    return (
        <Container fluid  className={ScanProductModeScss.MainComponent}>
            <div className={ScanProductModeScss.navBar}>
                <Container>
                    <h1>Checkout</h1>
                </Container>
            </div>

            <Container fluid='lg' className="mt-3">
                {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
                <Row className={ScanProductModeScss.checkOutRow}>
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
                                required
                                style={{
                                    width: '100%',
                                    maxWidth: 500
                                }}
                            />
                        </Form.Group>

                        {/* Discount Dropdown */}
                        <Form.Group className="mt-2">
                            <Form.Label>Discount:</Form.Label>
                            <Form.Select
                                size="sm"
                                value={selectedDiscount}
                                onChange={(e) => handleDiscountChange(e.target.value)}
                                style={{
                                    width: '100%',
                                    maxWidth: '200px'
                                }}
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
                        <Form.Group className="mt-2">
                            <Form.Label>Tax Rate:</Form.Label>
                            <Form.Select
                                size="sm"
                                value={selectedTaxRate}
                                onChange={(e) => handleGlobalTaxChange(e.target.value)}
                                style={{
                                    width: '100%',
                                    maxWidth: '200px'
                                }}
                            >
                                <option value={0}>No Tax</option>
                                {availableTaxes.map(tax => (
                                    <option key={tax.id} value={tax.value}>
                                        {tax.name} - {tax.value}%
                                    </option>
                                ))}
                            </Form.Select>

                            {/* Payment Amount */}
                            <Form.Group className="mt-2">
                                <Form.Label>Amount Paid:</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="Enter payment amount"
                                    value={paymentAmount}
                                    onChange={handlePaymentChange}
                                    style={{
                                        width: '100%',
                                        maxWidth: '200px'
                                    }}
                                />
                            </Form.Group>
                        </Form.Group>

                        <Table striped bordered hover className="mt-3">
                            <thead>
                                <tr>
                                    <th>Description</th>
                                    <th>Qty</th>
                                    <th>Unit Price</th>
                                    <th>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {scannedItems.map(item => (
                                    <tr key={item.productId}>
                                        <td>{item.productName}-{item.wattage}-{item.voltage}-{item.size}-{item.color}</td>
                                        <td>{item.quantity}</td>
                                        <td>₱{parseFloat(item.price).toFixed(2)}</td>
                                        <td>₱{(parseFloat(item.price) * item.quantity).toFixed(2)}</td>
                                    </tr>
                                ))}
                                <tr>
                                    <td colSpan="3" className="text-end"><strong>Subtotal:</strong></td>
                                    <td>₱{subtotal.toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <td colSpan="3" className="text-end"><strong>Discount:</strong></td>
                                    <td>-₱{discountAmount.toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <td colSpan="3" className="text-end"><strong>Total Tax:</strong></td>
                                    <td>₱{taxAmount.toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <td colSpan="3" className="text-end"><strong>Total Quantity:</strong></td>
                                    <td>{totalQuantity}</td>
                                </tr>
                                <tr>
                                    <td colSpan="3" className="text-end"><strong>Total:</strong></td>
                                    <td>₱{total.toFixed(2)}</td>
                                </tr>
                            </tbody>
                            {/* Displaying Change */}
                            {paymentAmount && paymentAmount >= total && (
                                <div className="mt-2">
                                    <strong className="fs-6 fw-medium">Change: </strong>₱{change.toFixed(2)}
                                </div>
                            )}

                        </Table>
                        <Button variant="success" onClick={handleCheckout}>Finalize Checkout</Button>
                            
                    </Col>
                </Row>
            </Container>
        </Container>
    );
}

export default Checkout;
