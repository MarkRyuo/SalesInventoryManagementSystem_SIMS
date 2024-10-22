import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Form, Button, Row, Col, Card, Alert } from 'react-bootstrap';
import { useState } from 'react';
import { addNewProduct } from '../../../services/ProductService'; // Import the service

function NewAssets() {
    const location = useLocation();
    const navigate = useNavigate();
    const barcode = location.state?.barcode || '';
    const [productName, setProductName] = useState('');
    const [quantity] = useState(1);
    const [error, setError] = useState('');

    const handleDone = async () => {
        try {
            // Try to add a new product, if barcode exists, catch the error
            await addNewProduct(barcode, productName, quantity);
            // Navigate to a success page
            navigate('/ProductSuccess');
        } catch (error) {
            // Show error message if barcode already exists
            setError(error.message);
        }
    };

    return (
        <Container className="mt-4">
            <Row className="justify-content-center">
                <Col md={8}>
                    <Card className="p-4 shadow">
                        <h1 className="text-center">Add New Product</h1>
                        {error && <Alert variant="danger">{error}</Alert>}
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
                                    readOnly
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
