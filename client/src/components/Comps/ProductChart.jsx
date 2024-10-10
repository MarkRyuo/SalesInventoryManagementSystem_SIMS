// ProductChart.jsx
import React, { useState, useEffect } from 'react';
import { Table, Button } from 'react-bootstrap';
import { db } from '../../firebase'; // Ensure Firebase is set up properly
import { ref, onValue, remove } from 'firebase/database'; // Import Realtime Database functions
import NewProduct from './NewProduct'; // Import NewProduct directly for conditional rendering

function ProductChart() {
    const [products, setProducts] = useState([]);
    const [showNewProduct, setShowNewProduct] = useState(false); // Add state to track when to show NewProduct

    // Fetch products from Realtime Database in real-time
    useEffect(() => {
        const productsRef = ref(db, 'products'); // Reference to 'products' node in Realtime Database
        const unsubscribe = onValue(productsRef, (snapshot) => {
            const productData = snapshot.val();
            const productList = productData ? Object.keys(productData).map(id => ({
                id,
                ...productData[id],
            })) : [];
            setProducts(productList);
        });

        return () => unsubscribe(); // Cleanup subscription on unmount
    }, []);

    // Function to handle delete
    const handleDelete = async (productId) => {
        try {
            await remove(ref(db, `products/${productId}`));
            alert("Product deleted successfully");
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    };

    // Show the NewProduct component when the button is clicked
    if (showNewProduct) {
        return <NewProduct onBack={() => setShowNewProduct(false)} />; // Pass onBack function to NewProduct
    }

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                {/* New Item Button */}
                <Button variant="primary" onClick={() => setShowNewProduct(true)}>New Item</Button>

                {/* Scan Button (placeholder for now) */}
                <Button variant="secondary">Scan</Button>
            </div>

            {/* Product Table */}
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Product ID</th>
                        <th>Product Name</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => (
                        <tr key={product.id}>
                            <td>{product.id}</td>
                            <td>{product.productName}</td>
                            <td>{product.quantity}</td>
                            <td>{product.price}</td>
                            <td>
                                {/* Edit and Delete Buttons */}
                                <Button variant="warning" style={{ marginRight: '10px' }}>
                                    Edit
                                </Button>
                                <Button variant="danger" onClick={() => handleDelete(product.id)}>Delete</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </>
    );
}

export default ProductChart;
