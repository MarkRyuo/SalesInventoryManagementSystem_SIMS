/* eslint-disable no-undef */
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Form, Button, Row, Col, Card } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { getDatabase, ref, set } from 'firebase/database';

function NewAssets() {
    const location = useLocation();
    const navigate = useNavigate();
    const barcode = location.state?.barcode || '';
    const [productName, setProductName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [sku, setSku] = useState(''); // State for SKU

    useEffect(() => {
        // Here you could fetch SKU or any other product details using the barcode
        const db = getDatabase();
        const productRef = ref(db, 'products/' + barcode);

        // Fetch product data from Firebase
        get(productRef).then(snapshot => {
            if (snapshot.exists()) {
                const productData = snapshot.val();
                setProductName(productData.name); // Assuming you have a 'name' field
                setSku(productData.sku); // Assuming you have a 'sku' field
            }
        });
    }, [barcode]);

    const handleDone = () => {
        const newProduct = {
            barcode,
            name: productName,
            sku,
            quantity: parseInt(quantity), // Ensure quantity is a number
        };

        // Save the new product to Firebase
        const db = getDatabase();
        set(ref(db, 'products/' + barcode), newProduct)
            .then(() => {
                navigate('/ProductSuccess');
            })
            .catch((error) => {
                console.error('Error adding product: ', error);
            });
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
                            <Form.Group controlId="sku">
                                <Form.Label>SKU</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={sku}
                                    readOnly // Set to readOnly if SKU is fetched automatically
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
                                    onChange={(e) => setQuantity(e.target.value)}
                                    placeholder="Enter quantity"
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
