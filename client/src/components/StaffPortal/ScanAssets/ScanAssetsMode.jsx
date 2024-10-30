import { Container, Navbar, Row, Col, Table, Button } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { updateProductQuantity } from '../../../services/ProductService';

function ScanAssetsMode() {
    const location = useLocation();
    const navigate = useNavigate();
    const scannedItems = location.state?.scannedItems || [];

    // Group items by product name, summing quantities and calculating totals
    const groupedItems = scannedItems.reduce((acc, item) => {
        const price = Number(item.price) || 0;
        const existingItem = acc.find(i => i.productName === item.productName);

        if (existingItem) {
            existingItem.quantity += item.quantity;
            existingItem.total += price * item.quantity;
        } else {
            acc.push({ ...item, total: price * item.quantity });
        }
        return acc;
    }, []);

    // Calculate total price for the order
    const totalPrice = groupedItems.reduce((total, item) => total + (item.total || 0), 0);

    const handleClearCart = () => {
        navigate('/PosScanner', { state: { scannedItems: [] } });
    };

    const handleCheckout = async () => {
        // Deduct quantities from the inventory
        const updatePromises = groupedItems.map(item => {
            return updateProductQuantity(item.barcode, -item.quantity);
        });

        try {
            await Promise.all(updatePromises); // Wait for all updates to complete
            navigate('/Checkout', { state: { scannedItems } }); // Proceed to checkout page
        } catch (error) {
            console.error("Error updating product quantities:", error);
            // Optionally, show an error message to the user
        }
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
                                {groupedItems.map(item => (
                                    <tr key={item.productId}>
                                        <td>{item.productName}</td>
                                        <td>{item.quantity}</td>
                                        <td>${Number(item.price).toFixed(2)}</td>
                                        <td>${(item.total || 0).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                        <Row className="mt-3">
                            <Col className="text-end">
                                <h4>Total: ${totalPrice.toFixed(2)}</h4>
                            </Col>
                        </Row>
                        <Row className="mt-3">
                            <Col className="text-end">
                                <Button variant="primary" onClick={handleCheckout}>Checkout</Button>
                                <Button variant="danger" onClick={handleClearCart} className="ms-2">Clear Cart</Button>
                            </Col>
                        </Row>
                    </>
                ) : (
                    <h4>No items in the cart</h4>
                )}
            </Container>
        </Container>
    );
}

export default ScanAssetsMode;
