import { Container, Navbar, Row, Col, Table, Button } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";

function ScanAssetsMode() {
    const location = useLocation();
    const navigate = useNavigate();
    const scannedItems = location.state?.scannedItems || []; // Get scanned items from state

    // Group items by product name and sum their quantities and totals
    const groupedItems = scannedItems.reduce((acc, item) => {
        const price = Number(item.price);
        const existingItem = acc.find(i => i.productName === item.productName);

        if (existingItem) {
            existingItem.quantity += item.quantity;
            existingItem.total += isNaN(price) ? 0 : price * item.quantity;
        } else {
            acc.push({
                ...item,
                total: isNaN(price) ? 0 : price * item.quantity
            });
        }

        return acc;
    }, []);

    const totalPrice = groupedItems.reduce((total, item) => total + item.total, 0);

    const handleClearCart = () => {
        navigate('/PosScanner', { state: { scannedItems: [] } }); // Clear cart and go back to scanner
    };

    return (
        <Container fluid className="m-0 p-0">
            <Navbar className="bg-body-tertiary">
                <Container>
                    <p className="fs-4 m-0">Current Order</p>
                </Container>
            </Navbar>
            <Container fluid='md' className="mt-3">
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
                                    const price = Number(item.price);
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
                                <Button variant="secondary" onClick={handleClearCart}>Clear Cart</Button>
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
