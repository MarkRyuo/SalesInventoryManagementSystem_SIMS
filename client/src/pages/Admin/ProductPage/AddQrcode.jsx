import { useState, useEffect, useRef } from 'react';
import { Container, Form, Button, Row, Col, Alert, Spinner, Modal } from 'react-bootstrap';
import { useLocation} from 'react-router-dom';
import QRCode from 'react-qr-code';
import { getCategories, saveProductToDatabase, saveQRCodeToFirestore } from '../../../services/ProductService'; // assuming you have a function to save QRCode to Firestore

// eslint-disable-next-line react/prop-types
function AddQrcode({ showModal, handleCloseModal }) {
    const location = useLocation();

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

    const qrcodeRef = useRef(null); // Ref for QR code canvas

    const sizes = ['S', 'M', 'L', 'XL', 'XXL'];

    // SKU Generation Function
    const generateSKU = (productName, size, color, wattage, voltage) => {
        const productCode = productName.slice(0, 3).toUpperCase().replace(/\s+/g, '');
        const sizeCode = size ? size.toUpperCase() : '';
        const colorCode = color ? color.toUpperCase() : '';
        const wattageCode = wattage ? `${wattage}W` : '';
        const voltageCode = voltage ? `${voltage}V` : '';
        const uniqueID = Date.now().toString().slice(-4);
        return `${productCode}-${sizeCode}-${colorCode}-${wattageCode}-${voltageCode}-${uniqueID}`;
    };

    // Barcode Generation Function (different from SKU logic)
    const generateBarcode = () => {
        return `BAR-${Date.now()}`;
    };

    // Fetch Categories
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

    // QR Code Generation Handler
    const handleGenerateQRCode = () => {
        if (!productName || !quantity || !price || !category) {
            setError('Please fill in all required fields.');
            return;
        }

        const generatedData = generateSKU(productName, size, color, wattage, voltage);
        if (!generatedData) {
            setError('Failed to generate QR code data.');
            return;
        }

        setQrcodeData(generatedData);
        setBarcode(generateBarcode()); // Set barcode with different logic
        setIsQRCodeGenerated(true);
        setError('');
    };

    // Convert QR Code to Base64
    const getQRCodeImageBase64 = () => {
        if (qrcodeRef.current) {
            const canvas = qrcodeRef.current.querySelector('canvas');
            if (canvas) {
                return canvas.toDataURL(); // This will give you the image as a Base64 string
            }
        }
        return '';
    };

    // Save Product Data Handler
    const handleSave = async () => {
        if (!productName || !category || !quantity || price <= 0) {
            setError('Please fill in all required fields and ensure the price is greater than 0.');
            return;
        }

        try {
            setError('');
            setIsLoading(true);

            // Get the Base64 representation of the QR code image
            const qrCodeBase64 = getQRCodeImageBase64();

            // Save the product details to Realtime Database
            const productData = {
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
            };

            console.log("Product data ready to be saved:", productData);

            // Call the service to save the product to the Realtime Database
            await saveProductToDatabase(productData);

            // Save the QR code image to Firestore, using barcodeValue or sku as the document ID
            await saveQRCodeToFirestore(barcodeValue, qrCodeBase64);

            // Navigate to Dashboard after saving
            handleCloseModal();  // Close modal after saving
        } catch (error) {
            setError(`Error saving product: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal show={showModal} onHide={handleCloseModal} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Set QR Code for Product</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container fluid='lg'>
                    <Row style={{ padding: 20 }}>
                        <Col lg={4} sm={12}>
                            <Form>
                                <Form.Group controlId="barcode">
                                    <Form.Label>Barcode</Form.Label>
                                    <Form.Control type="text" value={barcodeValue} readOnly />
                                </Form.Group>
                                <Form.Group controlId="sku">
                                    <Form.Label>SKU</Form.Label>
                                    <Form.Control type="text" value={generateSKU(productName, size, color, wattage, voltage)} readOnly />
                                </Form.Group>
                            </Form>
                        </Col>

                        <Col lg={8} sm={12}>
                            {error && <Alert variant="danger">{error}</Alert>}
                            {isLoading && <Spinner animation="border" className="mx-auto d-block" />}

                            <Form.Group controlId="productName">
                                <Form.Label>Product Name <span className="text-danger">*</span></Form.Label>
                                <Form.Control type="text" placeholder="Enter product name" value={productName} onChange={(e) => setProductName(e.target.value)} required />
                            </Form.Group>

                            <Form.Group controlId="size">
                                <Form.Label>Product Size (Optional)</Form.Label>
                                <Form.Control as="select" value={size} onChange={(e) => setSize(e.target.value)}>
                                    <option value="">Select Size</option>
                                    {sizes.map((size) => <option key={size} value={size}>{size}</option>)}
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId="color">
                                <Form.Label>Product Color (Optional)</Form.Label>
                                <Form.Control type="text" placeholder="Enter color" value={color} onChange={(e) => setColor(e.target.value)} />
                            </Form.Group>

                            <Form.Group controlId="wattage">
                                <Form.Label>Wattage</Form.Label>
                                <Form.Control type="text" placeholder="Enter wattage (e.g., 60W)" value={wattage} onChange={(e) => setWattage(e.target.value)} />
                            </Form.Group>

                            <Form.Group controlId="voltage">
                                <Form.Label>Voltage</Form.Label>
                                <Form.Control type="text" placeholder="Enter voltage (e.g., 220V)" value={voltage} onChange={(e) => setVoltage(e.target.value)} />
                            </Form.Group>

                            <Form.Group controlId="quantity">
                                <Form.Label>Quantity <span className="text-danger">*</span></Form.Label>
                                <Form.Control type="number" value={quantity} min={1} onChange={(e) => setQuantity(Number(e.target.value))} required />
                            </Form.Group>

                            <Form.Group controlId="price">
                                <Form.Label>Price <span className="text-danger">*</span></Form.Label>
                                <Form.Control type="number" value={price} min={0} onChange={(e) => setPrice(Number(e.target.value))} required />
                            </Form.Group>

                            <Form.Group controlId="category">
                                <Form.Label>Category <span className="text-danger">*</span></Form.Label>
                                <Form.Control as="select" value={category} onChange={(e) => setCategory(e.target.value)} required>
                                    <option value="">Select Category</option>
                                    {categories.map((category, index) => (
                                        <option key={index} value={category.name}>{category.name}</option>
                                    ))}
                                </Form.Control>
                            </Form.Group>

                            <Button variant="primary" onClick={handleGenerateQRCode} className="mt-3">
                                Generate QR Code
                            </Button>

                            {isQRCodeGenerated && (
                                <div className="mt-3">
                                    <QRCode value={qrcodeData} size={200} />
                                    <div ref={qrcodeRef} style={{ display: 'none' }}>
                                        <QRCode value={qrcodeData} size={200} />
                                    </div>
                                </div>
                            )}

                            <Button variant="success" onClick={handleSave} className="mt-3">
                                Save Product
                            </Button>
                        </Col>
                    </Row>
                </Container>
            </Modal.Body>
        </Modal>
    );
}

export default AddQrcode;
