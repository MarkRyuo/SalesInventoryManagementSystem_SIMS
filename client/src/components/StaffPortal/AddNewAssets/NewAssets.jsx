import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Form, Button, Row, Col, Card, Alert } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { addNewProduct } from '../../../services/ProductService'; // Import the service

function NewAssets() {
    const location = useLocation();
    const navigate = useNavigate();
    const barcode = location.state?.barcode || '';
    const [productName, setProductName] = useState('');
    const [size, setSize] = useState(''); // Size state
    const [color, setColor] = useState(''); // Color state
    const [wattage, setWattage] = useState(''); // Wattage state
    const [voltage, setVoltage] = useState(''); // Voltage state
    const [quantity, setQuantity] = useState(1);
    const [sku, setSku] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [newCategory, setNewCategory] = useState('');
    const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);
    const [categories, setCategories] = useState(['Electronics', 'Clothing', 'Furniture', 'Groceries', 'Stationery']); // Predefined categories
    const [error, setError] = useState('');
    const [dateAdded, setDateAdded] = useState(''); // Date state

    // Predefined sizes for dropdown
    const sizes = ['S', 'M', 'L', 'XL', 'XXL'];

    // Set the current date as the default dateAdded value
    useEffect(() => {
        const currentDate = new Date().toISOString().split('T')[0];
        setDateAdded(currentDate);
    }, []);

    // Function to generate SKU
    const generateSKU = (productName, category, wattage, voltage) => {
        const productCode = productName.slice(0, 3).toUpperCase().replace(/\s+/g, '');
        const categoryCode = category.slice(0, 3).toUpperCase();
        const wattageCode = wattage ? wattage + 'W' : ''; // Append "W" to wattage
        const voltageCode = voltage ? voltage + 'V' : ''; // Append "V" to voltage
        const uniqueID = Date.now().toString().slice(-4);
        return `${categoryCode}-${productCode}-${wattageCode}-${voltageCode}-${uniqueID}`;
    };

    const handleCategoryChange = (e) => {
        setCategory(e.target.value);
    };

    const handleAddNewCategoryClick = () => {
        setIsAddingNewCategory(true);
    };

    const handleSaveNewCategory = () => {
        if (newCategory) {
            setCategories([...categories, newCategory]);
            setCategory(newCategory);
            setNewCategory('');
            setIsAddingNewCategory(false);
        }
    };

    const handleDone = async () => {
        try {
            // Generate SKU based on product name, selected category, wattage, and voltage
            const generatedSku = generateSKU(productName, category, wattage, voltage);
            await addNewProduct({ barcode, productName, size, color, wattage, voltage, quantity, sku: generatedSku, price, category, dateAdded });
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
                            {/* Grouping barcode and SKU */}
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
                                        value={sku}
                                        onChange={(e) => setSku(e.target.value)}
                                        placeholder="Enter SKU"
                                        readOnly
                                    />
                                </Form.Group>
                            </div>

                            {/* Grouping productName, size, color, wattage, and voltage in a single div */}
                            <div className="mt-4 p-3 border rounded">
                                <h5>Product Information</h5>
                                <Form.Group controlId="productName">
                                    <Form.Label>Product Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={productName}
                                        onChange={(e) => setProductName(e.target.value)}
                                        placeholder="Enter product name"
                                    />
                                </Form.Group>
                                <Form.Group controlId="size">
                                    <Form.Label>Size</Form.Label>
                                    <Form.Select value={size} onChange={(e) => setSize(e.target.value)}>
                                        <option value="">Select Size</option>
                                        {sizes.map((s, idx) => (
                                            <option key={idx} value={s}>
                                                {s}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group controlId="color">
                                    <Form.Label>Color</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={color}
                                        onChange={(e) => setColor(e.target.value)}
                                        placeholder="Enter color"
                                    />
                                </Form.Group>
                                <Form.Group controlId="wattage">
                                    <Form.Label>Wattage (W)</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={wattage}
                                        onChange={(e) => setWattage(e.target.value)}
                                        placeholder="Enter wattage (e.g., 60)"
                                    />
                                </Form.Group>
                                <Form.Group controlId="voltage">
                                    <Form.Label>Voltage (V)</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={voltage}
                                        onChange={(e) => setVoltage(e.target.value)}
                                        placeholder="Enter voltage (e.g., 220)"
                                    />
                                </Form.Group>
                            </div>

                            <Form.Group controlId="dateAdded">
                                <Form.Label>Date Added</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={dateAdded}
                                    onChange={(e) => setDateAdded(e.target.value)}
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

                            {/* Button to add new category */}
                            <Button variant="secondary" onClick={handleAddNewCategoryClick} className="mt-2">
                                Add New Category
                            </Button>

                            {/* Show new category input if 'Add New Category' button is clicked */}
                            {isAddingNewCategory && (
                                <Form.Group controlId="newCategory" className="mt-3">
                                    <Form.Label>New Category</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={newCategory}
                                        onChange={(e) => setNewCategory(e.target.value)}
                                        placeholder="Enter new category"
                                    />
                                    <Button variant="success" onClick={handleSaveNewCategory} className="mt-2">
                                        Save New Category
                                    </Button>
                                </Form.Group>
                            )}

                            <Button variant="primary" onClick={handleDone} className="mt-4">
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
