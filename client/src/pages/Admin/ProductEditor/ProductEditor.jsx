import { useEffect, useState } from 'react';
import { getAllProducts, getCategories } from '../../../services/ProductService'; // Add getCategories import
import { Container, Row, Col, ListGroup, Card, Spinner, Button, Form, Modal } from 'react-bootstrap';

function ProductEditor() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]); // State for categories
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editProduct, setEditProduct] = useState(null);

    // Fetch products and categories on mount
    useEffect(() => {
        const fetchProductsAndCategories = async () => {
            try {
                const productsList = await getAllProducts();
                const categoriesList = await getCategories(); // Fetch categories
                setProducts(productsList);
                setCategories(categoriesList); // Set categories
            } catch (error) {
                console.error('Error fetching data:', error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProductsAndCategories();
    }, []);

    const openModal = (product) => {
        setEditProduct(product);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditProduct(null);
    };

    const handleModalInputChange = (key, value) => {
        setEditProduct((prev) => ({ ...prev, [key]: value }));
    };

    const saveChanges = () => {
        console.log('Saving changes for product:', editProduct);
        setProducts((prev) =>
            prev.map((product) => (product.barcode === editProduct.barcode ? editProduct : product))
        );
        closeModal();
    };

    const includedFields = [
        'productName',
        'price',
        'category',
        'quantity',
        'color',  // This will now be a regular text input
        'size',
        'watt',
        'voltage',
    ];

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
                                                <div><strong>Price:</strong> ${product.price}</div>
                                                <div><strong>SKU:</strong> {product.sku}</div>
                                                <div><strong>Barcode:</strong> {product.barcode}</div>
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
                    <Modal.Title>
                        {editProduct ? editProduct.productName : 'Edit Product'}
                        {editProduct && (
                            <>
                                <p className='fs-5 m-0 p-0'>SKU: {editProduct.sku}</p>
                                <p className='fs-5'>Barcode: {editProduct.barcode}</p>
                            </>
                        )}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {editProduct && (
                        <Form>
                            {/* Render the editable fields */}
                            {includedFields.map((key) => (
                                <Form.Group controlId={`form${key}`} key={key}>
                                    <Form.Label>{key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}</Form.Label>
                                    {key === 'category' ? (
                                        <Form.Control
                                            as="select"
                                            value={editProduct[key]}
                                            onChange={(e) => handleModalInputChange(key, e.target.value)}
                                        >
                                            <option value="">Select {key}</option>
                                            {categories.map((category) => (
                                                <option key={category} value={category}>
                                                    {category}
                                                </option>
                                            ))}
                                        </Form.Control>
                                    ) : key === 'price' || key === 'quantity' ? (
                                        <Form.Control
                                            type="number"
                                            value={editProduct[key]}
                                            onChange={(e) => handleModalInputChange(key, e.target.value)}
                                            style={{ appearance: 'none', MozAppearance: 'textfield' }} // Removes spinner
                                        />
                                    ) : (
                                        <Form.Control
                                            type={key === 'color' ? 'text' : (typeof editProduct[key] === 'number' ? 'number' : 'text')}
                                            value={editProduct[key]}
                                            onChange={(e) => handleModalInputChange(key, e.target.value)}
                                        />
                                    )}
                                </Form.Group>
                            ))}
                        </Form>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeModal}>Cancel</Button>
                    <Button variant="primary" onClick={saveChanges}>Save Changes</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default ProductEditor;
