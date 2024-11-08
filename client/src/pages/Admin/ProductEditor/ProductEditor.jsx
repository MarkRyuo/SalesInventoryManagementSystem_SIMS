import { useEffect, useState } from 'react';
import { getAllProducts, getCategories } from '../../../services/ProductService'; // Add getCategories import
import { Container, ListGroup, Card, Spinner, Button, Form, Modal, Row, Col } from 'react-bootstrap';
import { updateProductInDatabase } from '../../../services/ProductService'; // Function to update product in Firebase
import ProductEditorscss from './ProductEditor.module.scss';
import { LuFileEdit } from "react-icons/lu";

function ProductEditor() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editProduct, setEditProduct] = useState(null);

    useEffect(() => {
        const fetchProductsAndCategories = async () => {
            try {
                const productsList = await getAllProducts();
                const categoriesList = await getCategories();
                setProducts(productsList);
                setCategories(categoriesList);
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

    const saveChanges = async () => {
        try {
            console.log('Saving changes for product:', editProduct);

            // Update the product in the state
            setProducts((prev) =>
                prev.map((product) => (product.barcode === editProduct.barcode ? editProduct : product))
            );

            // Call the service function to save the updated product in Firebase
            await updateProductInDatabase(editProduct);

            closeModal();
        } catch (error) {
            console.error('Error saving changes:', error.message);
        }
    };

    const includedFields = [
        'productName',
        'price',
        'tax', // Add tax to the fields
        'category',
        'quantity',
        'color',
        'size',
        'wattage',
        'voltage',
    ];

    return (
        <Container className='m-0 p-0'>
            {loading ? (
                <div className="text-center">
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : products.length > 0 ? (
                <div className={ProductEditorscss.rowProduct}>
                    <div>
                        <ListGroup className={ProductEditorscss.listGroupItem}>
                            {products.map((product) => (
                                <ListGroup.Item key={product.barcode} className="d-flex align-items-center p-0">
                                    <Card className="w-100">
                                        <Card.Body className={ProductEditorscss.cardBody}>
                                            <Card.Title className={ProductEditorscss.cardTitle}>{product.productName}</Card.Title>
                                            <Card.Text className={ProductEditorscss.cardText}>
                                                <div>
                                                    <p className='m-0 p-0'>Price: <span>₱{product.price.toFixed(2)}</span></p>
                                                    <p className='m-0 p-0'>Tax: <span>{product.tax}%</span></p>
                                                    <p className='m-0 p-0'>SKU: <span>{product.sku}</span></p>
                                                    <p className='m-0 p-0'>Barcode: <span>{product.barcode}</span></p>
                                                </div>
                                                <div>
                                                    <Button variant="primary" onClick={() => openModal(product)} className="me-2">
                                                        <LuFileEdit size={20} />
                                                    </Button>
                                                </div>
                                            </Card.Text>
                                        </Card.Body>
                                    </Card>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </div>
                </div>
            ) : (
                <p className="text-center">No products found.</p>
            )}

            {/* Product Details and Edit Modal */}
            <Modal
                show={showModal}
                onHide={closeModal}
                centered
                backdrop="static" // Makes the backdrop static, optional
                size="lg" // Larger modal size for better form display
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        {editProduct ? editProduct.productName : 'Edit Product'}
                        {editProduct && (
                            <>
                                <p className='fs-6 m-0 p-0'>SKU: {editProduct.sku}</p>
                                <p className='fs-6'>Barcode: {editProduct.barcode}</p>
                            </>
                        )}
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {editProduct && (
                        <Form>
                            <Container>
                                <Row>
                                    {/* Loop through included fields with a better layout */}
                                    {includedFields.map((key) => (
                                        <Col xs={12} md={6} key={key} className="mb-3">
                                            <Form.Group controlId={`form${key}`}>
                                                <Form.Label>
                                                    {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                                                </Form.Label>

                                                {/* Dropdown for category */}
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
                                                ) :

                                                    /* Number input for price, quantity, and tax */
                                                    key === 'price' || key === 'quantity' || key === 'tax' ? (
                                                        <Form.Control
                                                            type="number"
                                                            value={editProduct[key]}
                                                            onChange={(e) => handleModalInputChange(key, parseFloat(e.target.value))}
                                                            placeholder={key === 'price' ? "Enter price" : key === 'tax' ? "Enter tax (%)" : "Enter quantity"}
                                                            style={{ appearance: 'none', MozAppearance: 'textfield' }} // Removes spinner
                                                        />
                                                    ) :

                                                        /* Text input for other fields */
                                                        (
                                                            <Form.Control
                                                                type={key === 'color' ? 'text' : (typeof editProduct[key] === 'number' ? 'number' : 'text')}
                                                                value={editProduct[key]}
                                                                onChange={(e) => handleModalInputChange(key, e.target.value)}
                                                            />
                                                        )}
                                            </Form.Group>
                                        </Col>
                                    ))}
                                </Row>
                            </Container>
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
