import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Form, Button, Row, Col, Card } from 'react-bootstrap';
import { useState } from 'react';
import { getDatabase, ref, set } from 'firebase/database'; // Import required functions from Firebase

function NewAssets() {
    const location = useLocation();
    const navigate = useNavigate();
    const barcode = location.state?.barcode || '';
    const [productName, setProductName] = useState('');
    const [quantity] = useState(1); // Initialize quantity to 1

    const handleDone = async () => {
        const db = getDatabase(); // Get a reference to the Realtime Database
        const productRef = ref(db, 'products/' + barcode); // Create a reference to the 'products' node

        try {
            // Set the product data in Realtime Database
            await set(productRef, {
                barcode: barcode,
                productName: productName,
                quantity: quantity, // This will always be 1
            });

            // Navigate to a success page or display a success message
            navigate('/ProductSuccess');
        } catch (error) {
            console.error("Error adding product: ", error);
        }
    };

    return (
        <Container className="mt-4">
            <Row className="justify-content-center">
                <Col md={8}>
                    <Card className="p-4 shadow">
                        <h1 className="text-center">Add New Product</h1>
                        <Form>
                            <Form.Group controlId="barcode">
                                <Form.Label>Barcode</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={barcode}
                                    readOnly
                                />
                            </Form.Group>
                            <Form.Group controlId="productName">
                                <Form.Label>Product Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={productName}
                                    onChange={(e) => setProductName(e.target.value)}
                                    placeholder="Enter product name"
                                />
                            </Form.Group>
                            <Form.Group controlId="quantity">
                                <Form.Label>Quantity</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={quantity}
                                    readOnly // Optional: Make quantity read-only if you want it fixed at 1
                                />
                            </Form.Group>
                            <Button variant="primary" onClick={handleDone}>
                                Done
                            </Button>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default NewAssets;
