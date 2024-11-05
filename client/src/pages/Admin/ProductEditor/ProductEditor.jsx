import { useEffect, useState } from 'react';
import { getAllProducts } from '../../../services/ProductService'; // Update with actual path to your functions file
import { Container, Row, Col, ListGroup, Card, Spinner, Button, Form, Modal } from 'react-bootstrap';

function ProductEditor() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false); // Controls modal visibility
    const [editProduct, setEditProduct] = useState(null); // Holds the product being edited

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

    // Open the modal for viewing and editing a product
    const openModal = (product) => {
        setEditProduct(product);
        setShowModal(true);
    };

    // Close the modal
    const closeModal = () => {
        setShowModal(false);
        setEditProduct(null);
    };

    // Handle input change for the modal fields
    const handleModalInputChange = (key, value) => {
        setEditProduct((prev) => ({ ...prev, [key]: value }));
    };

    // Save changes from the modal
    const saveChanges = () => {
        console.log('Saving changes for product:', editProduct);
        setProducts((prev) =>
            prev.map((product) => (product.barcode === editProduct.barcode ? editProduct : product))
        );
        closeModal();
    };

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
                                                <div>
                                                    <strong>Price:</strong> ${product.price}
                                                </div>
                                                <div>
                                                    <strong>SKU:</strong> {product.sku}
                                                </div>
                                                <div>
                                                    <strong>Barcode:</strong> {product.barcode}
                                                </div>
                                            </Card.Text>

                                            <Button
                                                variant="info"
                                                onClick={() => openModal(product)}
                                                className="me-2"
                                            >
                                                Show Details / Edit
                                            </Button>
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

            {/* Product Details and Edit Modal */}
            <Modal show={showModal} onHide={closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{editProduct ? editProduct.productName : 'Edit Product'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {editProduct && (
                        <Form>
                            {Object.entries(editProduct).map(([key, value]) => {
                                // Don't show the barcode field in the form (since it might be used as an identifier)
                                if (key === 'barcode') return null;

                                return (
                                    <Form.Group controlId={`form${key}`} key={key}>
                                        <Form.Label>{key.charAt(0).toUpperCase() + key.slice(1)}</Form.Label>
                                        <Form.Control
                                            type={typeof value === 'number' ? 'number' : 'text'}
                                            value={value}
                                            onChange={(e) => handleModalInputChange(key, e.target.value)}
                                        />
                                    </Form.Group>
                                );
                            })}
                        </Form>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeModal}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={saveChanges}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default ProductEditor;
