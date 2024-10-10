import React, { useState } from 'react';
import { db } from '../../firebase'; // Ensure Firebase is set up properly
import { ref, set } from 'firebase/database'; // Import set function
import { Form, Button, Row, Col } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css'; // Import toast styles

function NewProduct({ onBack }) { // Accept onBack as a prop
    const [productName, setProductName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [price, setPrice] = useState('');

    // Function to generate a random product ID between 0 and 99999
    const generateRandomID = () => {
        return Math.floor(Math.random() * 100000); // Generates a random number between 0 and 99999
    };

    // Function to handle adding a new product
    const handleAddProduct = async (e) => {
        e.preventDefault();
        try {
            const productsRef = ref(db, 'products/' + generateRandomID()); // Create a unique path using a random ID
            await set(productsRef, { // Use set instead of push
                productID: generateRandomID(), // Add the random product ID
                productName,
                quantity: Number(quantity),
                price: Number(price)
            });
            toast.success("Product added successfully!"); // Show success toast
            
            // Clear the input fields after successful addition
            setProductName('');
            setQuantity('');
            setPrice('');
        } catch (error) {
            console.error("Error adding product:", error);
            toast.error("Error adding product."); // Show error toast
        }
    };

    return (
        <div>
            <h2>Add New Product</h2>
            <Form onSubmit={handleAddProduct}>
                <Form.Group controlId="productName">
                    <Form.Label>Product Name</Form.Label>
                    <Form.Control 
                        type="text" 
                        value={productName} 
                        onChange={(e) => setProductName(e.target.value)} 
                        required 
                    />
                </Form.Group>

                <Form.Group controlId="quantity">
                    <Form.Label>Quantity</Form.Label>
                    <Form.Control 
                        type="number" 
                        value={quantity} 
                        onChange={(e) => setQuantity(e.target.value)} 
                        required 
                    />
                </Form.Group>

                <Form.Group controlId="price">
                    <Form.Label>Price</Form.Label>
                    <Form.Control 
                        type="number" 
                        value={price} 
                        onChange={(e) => setPrice(e.target.value)} 
                        required 
                    />
                </Form.Group>

                <Row className="mt-3">
                    <Col>
                        <Button type="submit" variant="primary" style={{ width: '130px' }}>
                            Add Product
                        </Button>
                    </Col>
                    <Col>
                        <Button variant="secondary" onClick={onBack} style={{ width: '100px' }}>
                            Back
                        </Button>
                    </Col>
                </Row>
            </Form>

            <ToastContainer /> {/* Render ToastContainer here */}
        </div>
    );
}

export default NewProduct;
