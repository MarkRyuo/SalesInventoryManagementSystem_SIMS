import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Form, Button, Row, Col, Card, Alert } from 'react-bootstrap';
import { useState } from 'react';
import { addNewProduct } from '../../../services/ProductService'; // Import the service

function NewAssets() {
    const location = useLocation();
    const navigate = useNavigate();
    const barcode = location.state?.barcode || '';
    const [productName, setProductName] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [sku, setSku] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [newCategory, setNewCategory] = useState('');
    const [isNewCategory, setIsNewCategory] = useState(false);
    const [error, setError] = useState('');

    // Example categories for dropdown
    const categories = ['Electronics', 'Clothing', 'Furniture', 'Groceries', 'Stationery', 'Add New Category'];

    const handleCategoryChange = (e) => {
        const selectedCategory = e.target.value;
        if (selectedCategory === 'Add New Category') {
            setIsNewCategory(true); // Show input for new category
            setCategory('');
        } else {
            setIsNewCategory(false); // Hide input for new category
            setCategory(selectedCategory);
        }
    };

    const handleDone = async () => {
        try {
            // If a new category is being added, use that category
            const finalCategory = isNewCategory ? newCategory : category;

            // Add a new product, including the chosen or new category
            await addNewProduct({ barcode, productName, quantity, sku, price, category: finalCategory });
            navigate('/ProductSuccess');
        } catch (error) {
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
                            <Form.Group controlId="sku">
                                <Form.Label>SKU</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={sku}
                                    onChange={(e) => setSku(e.target.value)}
                                    placeholder="Enter SKU"
                                />
                            </Form.Group>
                            <Form.Group controlId="price">
                                <Form.Label>Price</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    placeholder="Enter price"
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
                            <Form.Group controlId="category">
                                <Form.Label>Category</Form.Label>
                                <Form.Select value={category} onChange={handleCategoryChange}>
                                    <option value="">Select Category</option>
                                    {categories.map((cat, idx) => (
                                        <option key={idx} value={cat}>
                                            {cat}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>

                            {isNewCategory && (
                                <Form.Group controlId="newCategory">
                                    <Form.Label>New Category</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={newCategory}
                                        onChange={(e) => setNewCategory(e.target.value)}
                                        placeholder="Enter new category"
                                    />
                                </Form.Group>
                            )}

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
