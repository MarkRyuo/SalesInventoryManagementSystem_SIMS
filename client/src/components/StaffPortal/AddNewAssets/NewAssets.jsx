import { useState } from 'react';

function NewAssets() {
    const [productName, setProductName] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [barcode, setBarcode] = useState('');

    const handleAddProduct = () => {
        // Logic for adding a new product goes here
        console.log({
            productName,
            category,
            price,
            quantity,
            barcode,
        });
        alert('Product added successfully!');
    };

    const handleScanBarcode = () => {
        // Logic for scanning barcode/QR code goes here
        alert('Barcode/QR code scanner opened!');
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>Add New Product</h2>
            <div style={styles.formGroup}>
                <label>Product Name</label>
                <input
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    style={styles.input}
                />
            </div>
            <div style={styles.formGroup}>
                <label>Category</label>
                <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={styles.input}
                />
            </div>
            <div style={styles.formGroup}>
                <label>Price</label>
                <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    style={styles.input}
                />
            </div>
            <div style={styles.formGroup}>
                <label>Quantity</label>
                <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    style={styles.input}
                />
            </div>
            <div style={styles.formGroup}>
                <label>Barcode/QR Code</label>
                <input
                    type="text"
                    value={barcode}
                    onChange={(e) => setBarcode(e.target.value)}
                    style={styles.input}
                    placeholder="Scan or enter barcode"
                />
                <button onClick={handleScanBarcode} style={styles.scanButton}>
                    Scan Barcode/QR Code
                </button>
            </div>
            <button onClick={handleAddProduct} style={styles.addButton}>
                Add Product
            </button>
        </div>
    );
}

const styles = {
    container: {
        maxWidth: '400px',
        margin: '0 auto',
        padding: '20px',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
    },
    heading: {
        textAlign: 'center',
        marginBottom: '20px',
    },
    formGroup: {
        marginBottom: '15px',
    },
    input: {
        width: '100%',
        padding: '10px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        marginTop: '5px',
    },
    scanButton: {
        marginTop: '10px',
        padding: '10px',
        backgroundColor: '#007BFF',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    addButton: {
        width: '100%',
        padding: '10px',
        backgroundColor: '#28A745',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
};

export default NewAssets;
