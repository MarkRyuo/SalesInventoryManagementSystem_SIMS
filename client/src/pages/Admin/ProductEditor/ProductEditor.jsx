import { useEffect, useState } from 'react';
import { getAllProducts } from '../../../services/ProductService'; // Update with actual path to your functions file
import { Container, Row, Col, ListGroup, Card, Spinner, Button, Form } from 'react-bootstrap';

function ProductEditor() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState({}); // Tracks edit mode status for each product
    const [showDetails, setShowDetails] = useState({}); // Tracks show details status for each product

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

    // Toggle edit mode for a product by barcode
    const toggleEditMode = (barcode) => {
        setEditMode((prev) => ({ ...prev, [barcode]: !prev[barcode] }));
    };

    // Toggle show details for a product by barcode
    const toggleShowDetails = (barcode) => {
        setShowDetails((prev) => ({ ...prev, [barcode]: !prev[barcode] }));
    };

    // Handle input change for editable fields
    const handleInputChange = (barcode, key, value) => {
        setProducts((prev) =>
            prev.map((product) =>
                product.barcode === barcode ? { ...product, [key]: value } : product
            )
        );
    };

    // Example save function placeholder
    const saveChanges = (barcode) => {
        // Here you would call an update function to save the changes to Firebase
        console.log('Saving changes for product:', products.find((p) => p.barcode === barcode));
        toggleEditMode(barcode);
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
                                            </Card.Text>

                                            {showDetails[product.barcode] && (
                                                <Card.Text className="mt-3">
                                                    {Object.entries(product).map(([key, value]) => (
                                                        key !== 'productName' && key !== 'price' && key !== 'sku' && (
                                                            <div key={key} className="mb-2">
                                                                <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>{' '}
                                                                {editMode[product.barcode] ? (
                                                                    <Form.Control
                                                                        type="text"
                                                                        value={value}
                                                                        onChange={(e) =>
                                                                            handleInputChange(product.barcode, key, e.target.value)
                                                                        }
                                                                    />
                                                                ) : (
                                                                    <span>{JSON.stringify(value)}</span>
                                                                )}
                                                            </div>
                                                        )
                                                    ))}
                                                </Card.Text>
                                            )}

                                            <Button
                                                variant={showDetails[product.barcode] ? "secondary" : "info"}
                                                onClick={() => toggleShowDetails(product.barcode)}
                                                className="me-2"
                                            >
                                                {showDetails[product.barcode] ? "Hide Details" : "Show Details"}
                                            </Button>

                                            {showDetails[product.barcode] && (
                                                <>
                                                    <Button
                                                        variant={editMode[product.barcode] ? "success" : "primary"}
                                                        onClick={() =>
                                                            editMode[product.barcode]
                                                                ? saveChanges(product.barcode)
                                                                : toggleEditMode(product.barcode)
                                                        }
                                                        className="me-2"
                                                    >
                                                        {editMode[product.barcode] ? "Save" : "Edit"}
                                                    </Button>
                                                    {editMode[product.barcode] && (
                                                        <Button
                                                            variant="secondary"
                                                            onClick={() => toggleEditMode(product.barcode)}
                                                        >
                                                            Cancel
                                                        </Button>
                                                    )}
                                                </>
                                            )}
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
