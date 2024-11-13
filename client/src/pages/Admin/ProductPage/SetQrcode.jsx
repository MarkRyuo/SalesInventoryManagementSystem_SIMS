import { useState, useEffect, useRef } from 'react';
import { Container, Form, Button, Row, Col, Alert, Spinner } from 'react-bootstrap';
import QRious from 'qrious';
import { useLocation, useNavigate } from 'react-router-dom';
import { getCategories } from '../../../services/ProductService';

function SetQrcode() {
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
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [qrcodeData, setQrcodeData] = useState('');
    const [barcodeValue, setBarcode] = useState(barcode);
    const [isQRCodeGenerated, setIsQRCodeGenerated] = useState(false);

    const qrcodeCanvasRef = useRef(null);

    const sizes = ['S', 'M', 'L', 'XL', 'XXL'];

    const generateSKU = (productName, size, color, wattage, voltage) => {
        const productCode = productName.slice(0, 3).toUpperCase().replace(/\s+/g, '');
        const sizeCode = size ? size.toUpperCase() : '';
        const colorCode = color ? color.toUpperCase() : '';
        const wattageCode = wattage ? wattage + 'W' : '';
        const voltageCode = voltage ? voltage + 'V' : '';
        const uniqueID = Date.now().toString().slice(-4);
        return `${productCode}-${sizeCode}-${colorCode}-${wattageCode}-${voltageCode}-${uniqueID}`;
    };

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const categories = await getCategories();
                setCategories(categories);
            } catch (error) {
                setError(`Error fetching categories: ${error.message}`);
            }
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        if (isQRCodeGenerated && productName && size && color && quantity && price && category) {
            const generatedData = generateSKU(productName, size, color, wattage, voltage);
            setQrcodeData(generatedData);
            setBarcode(generatedData);

            if (qrcodeCanvasRef.current) {
                console.log("Rendering QR code...");
                const qr = new QRious({
                    element: qrcodeCanvasRef.current,
                    value: generatedData,
                    size: 150,
                });
                qr.refresh();  // Force the QRious object to refresh the canvas
            } else {
                console.error("Canvas reference is null");
            }
        }
    }, [isQRCodeGenerated, productName, size, color, wattage, voltage, quantity, price, category]);



    const handleSave = async () => {
        if (!productName || !size || !color || !category || !quantity || !price) {
            setError('Please fill in all required fields.');
            return;
        }

        try {
            setIsLoading(true);
            console.log("Product data saved with QR code:", {
                barcode: barcodeValue,
                productName,
                size,
                color,
                wattage,
                voltage,
                quantity,
                sku: generateSKU(productName, size, color, wattage, voltage),
                price,
                category,
                qrcodeData
            });
            navigate('/ProductSuccess');
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGenerateQRCode = () => {
        setIsQRCodeGenerated(true); // Trigger QR code generation
    };

    return (
        <Container fluid className='m-0 p-0'>
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
                                                value={barcodeValue}
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
                                        <Form.Group controlId="size">
                                            <p className='m-1'>Product Size <sup>(Optional)</sup> </p>
                                            <Form.Control
                                                as="select"
                                                value={size}
                                                onChange={(e) => setSize(e.target.value)}
                                            >
                                                <option value="">Select Size</option>
                                                {sizes.map((size) => (
                                                    <option key={size} value={size}>{size}</option>
                                                ))}
                                            </Form.Control>
                                        </Form.Group>
                                    </Col>

                                    <Col lg={6} sm={12}>
                                        <Form.Group controlId="color">
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
                                            />
                                            {price <= 0 && <small className="text-danger">Please enter a valid price.</small>}
                                        </Form.Group>
                                    </Col>

                                    <Col lg={6} sm={12}>
                                        <Form.Group controlId="category" className="mt-3">
                                            <p className='m-0'>Category<span className="text-danger">*</span></p>
                                            <Form.Control
                                                as="select"
                                                value={category}
                                                onChange={(e) => setCategory(e.target.value)}
                                                required
                                            >
                                                <option value="">Select Category</option>
                                                {categories.map((cat) => (
                                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                                ))}
                                            </Form.Control>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <div className='mt-4'>
                                    <Button variant="primary" onClick={handleGenerateQRCode} block>
                                        Generate QR Code
                                    </Button>
                                    {isQRCodeGenerated && (
                                        <canvas ref={qrcodeCanvasRef}></canvas>
                                    )}
                                </div>

                                <Button
                                    variant="success"
                                    onClick={handleSave}
                                    block
                                    disabled={isLoading || !productName || !size || !color || !category || !quantity || !price}
                                    className="mt-3"
                                >
                                    {isLoading ? 'Saving...' : 'Save Product'}
                                </Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
        </Container>
    );
}

export default SetQrcode;
