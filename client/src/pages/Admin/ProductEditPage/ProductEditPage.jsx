import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Table, Dropdown } from 'react-bootstrap';
import { getAllProducts, updateProduct } from './firebaseFunctions'; // Assume this is where Firebase functions are located

const ProductEditPage = () => {
    const [products, setProducts] = useState([]);
    const [discount, setDiscount] = useState(0);  // Default discount
    const [tax, setTax] = useState(0);            // Default tax

    useEffect(() => {
        fetchProducts();
    }, []);

    // Fetch products from Firebase
    const fetchProducts = async () => {
        try {
            const productsList = await getAllProducts();
            setProducts(productsList);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    // Handle product update with tax and discount
    const handleUpdateProduct = async (barcode) => {
        const product = products.find((p) => p.barcode === barcode);
        if (product) {
            try {
                const updatedProduct = {
                    ...product,
                    price: product.price * ((100 - discount) / 100) * ((100 + tax) / 100), // Calculate price with tax and discount
                    discount,
                    tax
                };
                await updateProduct(barcode, updatedProduct);
                alert(`Product ${product.productName} updated with tax and discount!`);
            } catch (error) {
                console.error("Error updating product:", error);
            }
        }
    };

    return (
        <Container>
            <h2 className="my-4">Edit Products</h2>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Barcode</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Discount</th>
                        <th>Tax</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product.barcode}>
                            <td>{product.barcode}</td>
                            <td>{product.productName}</td>
                            <td>{product.price.toFixed(2)}</td>
                            <td>
                                <Dropdown onSelect={(value) => setDiscount(Number(value))}>
                                    <Dropdown.Toggle variant="secondary">
                                        {product.discount || 'Select Discount'}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        {[0, 5, 10, 15, 20].map((disc) => (
                                            <Dropdown.Item key={disc} eventKey={disc}>
                                                {disc}%
                                            </Dropdown.Item>
                                        ))}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </td>
                            <td>
                                <Dropdown onSelect={(value) => setTax(Number(value))}>
                                    <Dropdown.Toggle variant="secondary">
                                        {product.tax || 'Select Tax'}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        {[0, 5, 10, 15, 20].map((tax) => (
                                            <Dropdown.Item key={tax} eventKey={tax}>
                                                {tax}%
                                            </Dropdown.Item>
                                        ))}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </td>
                            <td>
                                <Button variant="primary" onClick={() => handleUpdateProduct(product.barcode)}>
                                    Update
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
};

export default ProductEditPage;
