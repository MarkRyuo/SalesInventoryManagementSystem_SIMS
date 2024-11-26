import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Form, Button, Row, Col, Alert, Spinner, Dropdown } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { addNewProduct, addCategory, getCategoriesNewAssets } from '../../../services/ProductService';
import { FaBoxOpen } from "react-icons/fa";
import StaffNavBar from "../../StaffPortal/StaffNavbar/StaffNavBar";



function NewAssets() {
    const location = useLocation();
    const navigate = useNavigate();
    const barcode = location.state?.barcode || 'DEFAULT-BARCODE';
    console.log("Barcode: ", barcode);


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
                const fetchedCategories = await getCategoriesNewAssets();
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
        const colorCode = color ? color.toUpperCase() : '';
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
                await addCategory(newCategory);
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
        // Validate all required fields
        if (!productName || !category || !quantity || !price) {
            setError('Please fill in all required fields.');
            return;
        }

        // Additional validation for numeric fields
        if (quantity < 1) {
            setError('Quantity must be at least 1.');
            return;
        }

        if (price <= 0) {
            setError('Price must be greater than 0.');
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


    const [backBtn] = useState([
        {
            btnIcon: <FaBoxOpen size={30} />,
            id: 1
        }
    ]);

    return (
        <Container fluid className='m-0 p-0'   style={{ background: "radial-gradient(1300px at 0.7% 3.4%, rgb(164, 231, 192) 0%, rgb(245, 255, 244) 50%)"}}>
            <StaffNavBar backBtn={backBtn.filter(Backbtn => Backbtn.id === 1)} />
            <Container fluid='lg'>
                <Row style={{ boxSizing: 'border-box', padding: 20, height: '80vh', paddingTop: 25 }}>

                    <Col lg={4} sm={12}>
                        <Row className="justify-content-center">
                            <Col md={8}>
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
                                </Form>
                            </Col>
                        </Row>
                    </Col>

                    <Col lg={8} sm={12}>
                        {error && <Alert variant="danger">{error}</Alert>}
                        {isLoading && <Spinner animation="border" className="mx-auto d-block" />}
                        <Row className='justify-content-center p-3' style={{ borderRadius: 20, boxShadow: '2px 2px 4px #E1E4E4' }}>
                            <Col md={12}>
                                <div className="mb-3">
                                    <p style={{ fontSize: '1.6rem' }}>Product Details</p>
                                    <Form.Group controlId="productName">
                                        <p className='m-0'>Product Name <span className="text-danger">*</span></p>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter product name (e.g., LED Bulb)"
                                            value={productName}
                                            onChange={(e) => setProductName(e.target.value)}
                                            required
                                        />
                                        {!productName && <small className="text-danger">Please enter a product name.</small>}
                                    </Form.Group>


                                    <Row className='mt-1'>
                                        <Col lg={6} sm={12}>
                                            <Form.Group controlId="size" className="">
                                                <p className='m-1'>Product Size <sup>(Optional)</sup> </p>
                                                <Dropdown>
                                                    <Dropdown.Toggle variant="outline-primary" id="dropdown-basic">
                                                        {size || 'Select Size'}
                                                    </Dropdown.Toggle>

                                                    <Dropdown.Menu>
                                                        {sizes.map((size) => (
                                                            <Dropdown.Item key={size} onClick={() => setSize(size)}>
                                                                {size}
                                                            </Dropdown.Item>
                                                        ))}
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </Form.Group>
                                        </Col>

                                        <Col lg={6} sm={12}>
                                            <Form.Group controlId="color" className="mt-1">
                                                <p className='m-0 mt-2'>Product Color <sup>(Optional)</sup></p>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Enter color (e.g., Red)"
                                                    value={color}
                                                    onChange={(e) => setColor(e.target.value)}
                                                />
                                            </Form.Group>
                                        </Col>

                                        <Col lg={6} sm={12}>
                                            <Form.Group controlId="wattage" className="mt-3">
                                                <p className='m-0'>Wattage</p>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Enter wattage (e.g., 60W)"
                                                    value={wattage}
                                                    onChange={(e) => setWattage(e.target.value)}
                                                />
                                            </Form.Group>
                                        </Col>

                                        <Col lg={6} sm={12}>
                                            <Form.Group controlId="voltage" className="mt-3">
                                                <p className='m-0'>Voltage</p>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Enter voltage (e.g., 220V)"
                                                    value={voltage}
                                                    onChange={(e) => setVoltage(e.target.value)}
                                                />
                                            </Form.Group>
                                        </Col>

                                        <Col lg={6} sm={12}>
                                            <Form.Group controlId="quantity" className="mt-3">
                                                <p className='m-0'>Quantity<span className="text-danger">*</span></p>
                                                <Form.Control
                                                    type="number"
                                                    value={quantity}
                                                    min={1}
                                                    placeholder="Enter quantity (e.g., 10)"
                                                    onChange={(e) => setQuantity(Number(e.target.value))}
                                                    required
                                                />
                                                {quantity < 1 && <small className="text-danger">Please enter a quantity of at least 1.</small>}
                                            </Form.Group>
                                        </Col>

                                        <Col lg={6} sm={12}>
                                            <Form.Group controlId="price" className="mt-3">
                                                <p className='m-0'>Price<span className="text-danger">*</span></p>
                                                <Form.Control
                                                    type="number"
                                                    placeholder="Enter price (e.g., 100.00)"
                                                    value={price}
                                                    onChange={(e) => setPrice(e.target.value)}
                                                    required
                                                    step="0.01"
                                                    style={{ appearance: 'textfield' }}
                                                />
                                                {!price && <small className="text-danger">Please enter a price.</small>}
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                </div>

                                <Col md={12}>
                                    <Form.Group controlId="category" className="mt-3">
                                        <p className='m-0'>Category<span className="text-danger">*</span></p>
                                        <Form.Control as="select" value={category} onChange={handleCategoryChange} required>
                                            <option value="">Select Category</option>
                                            {categories.map((cat, index) => (
                                                <option key={index} value={cat}>{cat}</option>  // Just use 'cat' here, which is a category name
                                            ))}
                                        </Form.Control>
                                        {!category && <small className="text-danger mx-2">Please select a category.</small>}
                                        <Button variant="link" onClick={handleAddNewCategoryClick} className='m-0 p-0'>+ Add New Category</Button>
                                    </Form.Group>

                                    {isAddingNewCategory && (
                                        <Form.Group controlId="newCategory" className="mt-3">
                                            <p className='m-0'>New Category</p>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter new category (e.g., Electronics)"
                                                value={newCategory}
                                                onChange={(e) => setNewCategory(e.target.value)}
                                            />
                                            <Button variant="primary" onClick={handleSaveNewCategory} className="mt-2">Save Category</Button>
                                        </Form.Group>
                                    )}

                                    <Button variant="success" className="my-3 px-5" onClick={handleDone}>Done</Button>
                                </Col>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
        </Container>
    );
}

export default NewAssets;
