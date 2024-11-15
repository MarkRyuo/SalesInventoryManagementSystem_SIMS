import { useEffect, useState } from 'react';
import { getAllProducts, getCategories } from '../../../services/ProductService';
import { Container, ListGroup, Card, Spinner, Button, Form, Modal, Row, Col } from 'react-bootstrap';
import { updateProductInDatabase, deleteProduct } from '../../../services/ProductService';
import ProductEditorscss from './ProductEditor.module.scss';
import { LuFileEdit } from "react-icons/lu";

function ProductEditor() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editProduct, setEditProduct] = useState(null);
    const [showSaveConfirmation, setShowSaveConfirmation] = useState(false); // Confirmation for saving
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false); // Confirmation for deleting

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

    const confirmSaveChanges = () => {
        setShowSaveConfirmation(true);
    };

    const confirmDeleteProduct = () => {
        setShowDeleteConfirmation(true);
    };

    const saveChanges = async () => {
        try {
            console.log('Saving changes for product:', editProduct);
            setProducts((prev) =>
                prev.map((product) => (product.barcode === editProduct.barcode ? editProduct : product))
            );
            await updateProductInDatabase(editProduct);
            setShowSaveConfirmation(false);
            closeModal();
        } catch (error) {
            console.error('Error saving changes:', error.message);
        }
    };

    const handleDeleteProduct = async () => {
        try {
            if (editProduct) {
                await deleteProduct(editProduct.barcode);
                setProducts((prev) => prev.filter((product) => product.barcode !== editProduct.barcode));
                setShowDeleteConfirmation(false);
                closeModal();
            }
        } catch (error) {
            console.error('Error deleting product:', error.message);
        }
    };

    const includedFields = [
        'productName',
        'price',
        'category',
        'quantity',
        'color',
        'size',
        'wattage',
        'voltage',
        'instockthreshold',
    ];

    const sortedProducts = products.sort((a, b) => {
        const aIsUnset = !a.instockthreshold;
        const bIsUnset = !b.instockthreshold;
        if (aIsUnset && !bIsUnset) return -1;
        if (!aIsUnset && bIsUnset) return 1;
        return 0;
    });

    return (
        <Container className='m-0 p-0'>
            {loading ? (
                <div className="text-center">
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : sortedProducts.length > 0 ? (
                <div className={ProductEditorscss.rowProduct}>
                    <div>
                        <ListGroup className={ProductEditorscss.listGroupItem}>
                            {sortedProducts.map((product) => (
                                <ListGroup.Item key={product.barcode} className="d-flex align-items-center p-0">
                                    <Button variant="primary" onClick={() => openModal(product)} className="me-2">
                                        <LuFileEdit size={20} />
                                    </Button>
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
                backdrop="static"
                size="lg"
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
                                <Row style={{ height: '45vh', overflow: 'auto' }}>
                                    {includedFields.map((key) => (
                                        <Col xs={12} md={6} key={key} className="mb-3">
                                            <Form.Group controlId={`form${key}`}>
                                                <Form.Label>
                                                    {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                                                </Form.Label>
                                                {key === 'category' ? (
                                                    <Form.Control
                                                        as="select"
                                                        value={editProduct[key]}
                                                        onChange={(e) => handleModalInputChange(key, e.target.value)}
                                                    >
                                                        <option value="">Select {key}</option>
                                                        {categories.map((category) => (
                                                            <option key={category.id} value={category.id}>
                                                                {category.name}
                                                            </option>
                                                        ))}
                                                    </Form.Control>
                                                ) : key === 'instockthreshold' ? (
                                                    <Form.Control
                                                        type="number"
                                                        value={editProduct[key]}
                                                        onChange={(e) => handleModalInputChange(key, parseFloat(e.target.value))}
                                                        placeholder="Enter stock threshold"
                                                        style={{ appearance: 'none', MozAppearance: 'textfield' }}
                                                    />
                                                ) : (
                                                    <Form.Control
                                                        type="text"
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
                    <Button variant="danger" onClick={confirmDeleteProduct}>Delete</Button>
                    <Button variant="primary" onClick={confirmSaveChanges}>Save Changes</Button>
                </Modal.Footer>
            </Modal>

            {/* Save Confirmation Modal */}
            <Modal
                show={showSaveConfirmation}
                onHide={() => setShowSaveConfirmation(false)}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Save</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to save the changes to this product?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowSaveConfirmation(false)}>Cancel</Button>
                    <Button variant="primary" onClick={saveChanges}>Yes, Save</Button>
                </Modal.Footer>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                show={showDeleteConfirmation}
                onHide={() => setShowDeleteConfirmation(false)}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this product?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteConfirmation(false)}>Cancel</Button>
                    <Button variant="danger" onClick={handleDeleteProduct}>Yes, Delete</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default ProductEditor;
