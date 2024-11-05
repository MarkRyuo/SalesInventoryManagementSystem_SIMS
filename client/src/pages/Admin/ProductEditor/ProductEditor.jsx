import { useEffect, useState } from 'react';
import { getAllProducts } from '../../../services/ProductService'; // Update with actual path to your functions file
import { Container, Row, Col, ListGroup, Card, Spinner } from 'react-bootstrap';

function ProductEditor() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch products on mount
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const productsList = await getAllProducts();
                setProducts(productsList);
            } catch (error) {
                console.error('Error fetching products:', error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return (
        <Container className="mt-4">
            <h1 className="text-center mb-4">Product List</h1>
            {loading ? (
                <div className="text-center">
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : products.length > 0 ? (
                <Row>
                    <Col md={{ span: 8, offset: 2 }}>
                        <ListGroup>
                            {products.map((product) => (
                                <ListGroup.Item key={product.barcode} className="d-flex align-items-center">
                                    <Card className="w-100">
                                        <Card.Body>
                                            <Card.Title>{product.productName}</Card.Title>
                                            <Card.Text>
                                                <strong>SKU:</strong> {product.sku} <br />
                                                <strong>Price:</strong> ${product.price} <br />
                                                <strong>Quantity:</strong> {product.quantity}
                                            </Card.Text>
                                        </Card.Body>
                                    </Card>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </Col>
                </Row>
            ) : (
                <p className="text-center">No products found.</p>
            )}
        </Container>
    );
}

export default ProductEditor;
