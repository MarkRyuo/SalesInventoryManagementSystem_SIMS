import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Form, Button, Row, Col, Alert, Spinner, Dropdown } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { addNewProduct, addCategory, getCategories } from '../../../services/ProductService';
import { FaBoxOpen } from "react-icons/fa";
import StaffNavBar from "../../StaffPortal/StaffNavbar/StaffNavBar";

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
    const [alertVisible, setAlertVisible] = useState(false);
    const [fadeOut, setFadeOut] = useState(false); // State for fade-out effect

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
                setAlertVisible(true);
                setFadeOut(false); // Reset fadeOut to false before showing
                setTimeout(() => {
                    setFadeOut(true); // Trigger fade out
                    setTimeout(() => setAlertVisible(false), 1000); // Hide alert after fade out
                }, 2000); // Show for 2 seconds
            }
        }
    };

    const handleDone = async () => {
        if (!productName || !size || !color || !category || !quantity || !price) {
            setError('Please fill in all required fields.');
            setAlertVisible(true);
            setFadeOut(false); // Reset fadeOut to false before showing
            setTimeout(() => {
                setFadeOut(true); // Trigger fade out
                setTimeout(() => setAlertVisible(false), 1000); // Hide alert after fade out
            }, 2000); // Show for 2 seconds
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
            setAlertVisible(true);
            setFadeOut(false); // Reset fadeOut to false before showing
            setTimeout(() => {
                setFadeOut(true); // Trigger fade out
                setTimeout(() => setAlertVisible(false), 1000); // Hide alert after fade out
            }, 2000); // Show for 2 seconds
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
        <Container fluid className='m-0 p-0'>
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
                        {alertVisible && error && (
                            <Alert
                                variant="danger"
                                style={{
                                    opacity: fadeOut ? 0 : 1,
                                    transition: 'opacity 1s ease-out',
                                }}
                            >
                                {error}
                            </Alert>
                        )}
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
                                                    placeholder="Enter wattage (e.g., 10W)"
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
                                                    placeholder="Enter voltage (e.g., 230V)"
                                                    value={voltage}
                                                    onChange={(e) => setVoltage(e.target.value)}
                                                />
                                            </Form.Group>
                                        </Col>

                                        <Col lg={6} sm={12}>
                                            <Form.Group controlId="quantity" className="mt-3">
                                                <p className='m-0'>Quantity</p>
                                                <Form.Control
                                                    type="number"
                                                    min={1}
                                                    value={quantity}
                                                    onChange={(e) => setQuantity(Number(e.target.value))}
                                                />
                                            </Form.Group>
                                        </Col>

                                        <Col lg={6} sm={12}>
                                            <Form.Group controlId="price" className="mt-3">
                                                <p className='m-0'>Price</p>
                                                <Form.Control
                                                    type="number"
                                                    min={0}
                                                    value={price}
                                                    onChange={(e) => setPrice(Number(e.target.value))}
                                                />
                                            </Form.Group>
                                        </Col>

                                        <Col lg={12} sm={12} className="mt-3">
                                            <Form.Group controlId="category">
                                                <p className='m-0'>Category <span className="text-danger">*</span></p>
                                                <Dropdown>
                                                    <Dropdown.Toggle variant="outline-primary" id="dropdown-basic">
                                                        {category || 'Select Category'}
                                                    </Dropdown.Toggle>
                                                    <Dropdown.Menu>
                                                        {categories.map((category, index) => (
                                                            <Dropdown.Item key={index} onClick={() => setCategory(category)}>
                                                                {category}
                                                            </Dropdown.Item>
                                                        ))}
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                                <Button variant="link" onClick={handleAddNewCategoryClick}>
                                                    + Add New Category
                                                </Button>
                                                {isAddingNewCategory && (
                                                    <div className="mt-2">
                                                        <Form.Control
                                                            type="text"
                                                            placeholder="Enter new category"
                                                            value={newCategory}
                                                            onChange={(e) => setNewCategory(e.target.value)}
                                                        />
                                                        <Button variant="success" className="mt-2" onClick={handleSaveNewCategory}>Save Category</Button>
                                                    </div>
                                                )}
                                                {!category && <small className="text-danger">Please select a category.</small>}
                                            </Form.Group>
                                        </Col>

                                        <Col lg={12} sm={12} className="mt-3">
                                            <Button variant="primary" onClick={handleDone}>
                                                Add Product
                                            </Button>
                                        </Col>
                                    </Row>
                                </div>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
        </Container>
    );
}

export default NewAssets;
