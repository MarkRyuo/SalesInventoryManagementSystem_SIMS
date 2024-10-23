import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Form, Button, Row, Col, Card, Alert, Spinner } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { addNewProduct, addCategory, getCategories } from '../../../services/ProductService'; // Import the services

function NewAssets() {
    const location = useLocation();
    const navigate = useNavigate();
    const barcode = location.state?.barcode || '';

    const [productName, setProductName] = useState('');
    const [size, setSize] = useState('');
    const [color, setColor] = useState('');
    const [wattage, setWattage] = useState('');
    const [voltage, setVoltage] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [newCategory, setNewCategory] = useState('');
    const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [dateAdded, setDateAdded] = useState('');

    const sizes = ['S', 'M', 'L', 'XL', 'XXL'];

    useEffect(() => {
        const currentDate = new Date().toISOString().split('T')[0];
        setDateAdded(currentDate);
    }, []);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const fetchedCategories = await getCategories();
                setCategories(fetchedCategories);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchCategories();
    }, []);

    const generateSKU = (productName, size, color, wattage, voltage) => {
        const productCode = productName.slice(0, 3).toUpperCase().replace(/\s+/g, '');
        const sizeCode = size ? size.toUpperCase() : '';
        const colorCode = color ? color.toUpperCase() : ''; // Include full color name
        const wattageCode = wattage ? wattage + 'W' : '';
        const voltageCode = voltage ? voltage + 'V' : '';
        const uniqueID = Date.now().toString().slice(-4);
        return `${productCode}-${sizeCode}-${colorCode}-${wattageCode}-${voltageCode}-${uniqueID}`;
    };

    const handleCategoryChange = (e) => {
        setCategory(e.target.value);
    };

    const handleAddNewCategoryClick = () => {
        setIsAddingNewCategory(true);
    };

    const handleSaveNewCategory = async () => {
        if (newCategory) {
            try {
                await addCategory(newCategory); // Save the new category in the database
                setCategories([...categories, newCategory]);
                setCategory(newCategory);
                setNewCategory('');
                setIsAddingNewCategory(false);
            } catch (error) {
                setError(error.message);
            }
        }
    };

    const handleDone = async () => {
        if (!productName || !size || !color || !category || !quantity || !price) {
            setError('Please fill in all required fields.');
            return;
        }

        try {
            setIsLoading(true);
            const generatedSku = generateSKU(productName, size, color, wattage, voltage);
            await addNewProduct({
                barcode,
                productName,
                size,
                color,
                wattage,
                voltage,
                quantity,
                sku: generatedSku,
                price,
                category,
                dateAdded
            });
            navigate('/ProductSuccess');
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container className="mt-4">
            <Row className="justify-content-center">
                <Col md={8}>
                    <Card className="p-4 shadow">
                        <h1 className="text-center">Add New Product</h1>
                        {error && <Alert variant="danger">{error}</Alert>}
                        {isLoading && <Spinner animation="border" className="mx-auto d-block" />}
                        <Form>
                            <div className="mb-3">
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
                                        value={generateSKU(productName, size, color, wattage, voltage)}
                                        readOnly
                                    />
                                </Form.Group>
                                <Form.Group controlId="dateAdded">
                                    <Form.Label>Date Added</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={dateAdded}
                                        readOnly
                                    />
                                </Form.Group>
                            </div>

                            <Form.Group controlId="productName">
                                <Form.Label>Product Name <span className="text-danger">*</span></Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter product name"
                                    value={productName}
                                    onChange={(e) => setProductName(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <Form.Group controlId="size" className="mt-3">
                                <Form.Label>Size <span className="text-danger">*</span></Form.Label>
                                <Form.Control as="select" value={size} onChange={(e) => setSize(e.target.value)} required>
                                    <option value="">Select Size</option>
                                    {sizes.map((size) => (
                                        <option key={size} value={size}>{size}</option>
                                    ))}
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId="color" className="mt-3">
                                <Form.Label>Color <span className="text-danger">*</span></Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter color"
                                    value={color}
                                    onChange={(e) => setColor(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <Form.Group controlId="wattage" className="mt-3">
                                <Form.Label>Wattage</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter wattage"
                                    value={wattage}
                                    onChange={(e) => setWattage(e.target.value)}
                                />
                            </Form.Group>

                            <Form.Group controlId="voltage" className="mt-3">
                                <Form.Label>Voltage</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter voltage"
                                    value={voltage}
                                    onChange={(e) => setVoltage(e.target.value)}
                                />
                            </Form.Group>

                            <Form.Group controlId="quantity" className="mt-3">
                                <Form.Label>Quantity <span className="text-danger">*</span></Form.Label>
                                <Form.Control
                                    type="number"
                                    value={quantity}
                                    min={1}
                                    onChange={(e) => setQuantity(Number(e.target.value))}
                                    required
                                />
                            </Form.Group>

                            <Form.Group controlId="price" className="mt-3">
                                <Form.Label>Price <span className="text-danger">*</span></Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="Enter price"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <Form.Group controlId="category" className="mt-3">
                                <Form.Label>Category <span className="text-danger">*</span></Form.Label>
                                <Form.Control as="select" value={category} onChange={handleCategoryChange} required>
                                    <option value="">Select Category</option>
                                    {categories.map((cat, index) => (
                                        <option key={index} value={cat}>{cat}</option>
                                    ))}
                                </Form.Control>
                                <Button variant="link" onClick={handleAddNewCategoryClick}>Add New Category</Button>
                            </Form.Group>

                            {isAddingNewCategory && (
                                <Form.Group controlId="newCategory" className="mt-3">
                                    <Form.Label>New Category</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter new category"
                                        value={newCategory}
                                        onChange={(e) => setNewCategory(e.target.value)}
                                    />
                                    <Button variant="primary" onClick={handleSaveNewCategory} className="mt-2">Save Category</Button>
                                </Form.Group>
                            )}

                            <Button variant="primary" className="mt-4" onClick={handleDone}>Add Product</Button>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default NewAssets;
