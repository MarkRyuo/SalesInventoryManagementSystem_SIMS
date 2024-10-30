import { Container, Navbar, Row, Col, Table, Button } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";

function ScanAssetsMode() {
    const location = useLocation();
    const navigate = useNavigate(); // Hook for navigation
    const scannedItems = location.state?.scannedItems || []; // Get scanned items from state

    // Group items by product name and sum their quantities and totals
    const groupedItems = scannedItems.reduce((acc, item) => {
        const price = Number(item.price);
        const existingItem = acc.find(i => i.productName === item.productName);

        if (existingItem) {
            // If the item already exists, increase quantity and total price
            existingItem.quantity += item.quantity;
            existingItem.total += isNaN(price) ? 0 : price * item.quantity;
        } else {
            // If it's a new item, add it to the array
            acc.push({
                ...item,
                total: isNaN(price) ? 0 : price * item.quantity // Initialize total price
            });
        }

        return acc;
    }, []);

    // Calculate total price of all grouped items
    const totalPrice = groupedItems.reduce((total, item) => total + item.total, 0);

    return (
        <Container fluid className="m-0 p-0">
            <Navbar className="bg-body-tertiary">
                <Container>
                    <p className="fs-4 m-0">Current Order</p>
                </Container>
            </Navbar>
            <Container fluid='md' className="mt-3">
                {/* List of products scanned */}
                {groupedItems.length > 0 ? (
                    <>
                        <Table striped bordered hover responsive>
                            <thead>
                                <tr>
                                    <th>Product Name</th>
                                    <th>Quantity</th>
                                    <th>Price</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {groupedItems.map((item, index) => {
                                    const price = Number(item.price); // Convert price to a number
                                    return (
                                        <tr key={index}>
                                            <td>{item.productName}</td>
                                            <td>{item.quantity}</td>
                                            <td>${isNaN(price) ? 'N/A' : price.toFixed(2)}</td>
                                            <td>${item.total.toFixed(2)}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </Table>
                        <Row className="mt-3">
                            <Col className="text-end">
                                <h5>Total Price: ${totalPrice.toFixed(2)}</h5>
                            </Col>
                        </Row>
                        <Row className="mt-3">
                            <Col className="text-end">
                                <Button variant="primary" className="me-2">Checkout</Button>
                                <Button variant="secondary">Clear Cart</Button>
                                <Button
                                    variant="outline-primary"
                                    className="ms-2"
                                    onClick={() => navigate('/PosScanner')} // Adjust the path to your scanning component
                                >
                                    Scan Again
                                </Button>
                            </Col>
                        </Row>
                    </>
                ) : (
                    <p>No items scanned yet.</p>
                )}
            </Container>
        </Container>
    );
}

export default ScanAssetsMode;
