import { useState } from 'react';

function AddNewAssets() {
    const [productName, setProductName] = useState('');
    const [category, setCategory] = useState('');
    const [barcode, setBarcode] = useState('');

    const handleScanBarcode = () => {
        // Logic for scanning barcode/QR code goes here
        alert('Barcode/QR code scanner opened!');
    };

    const handleAddProduct = () => {
        // Logic for adding a new product goes here
        console.log({
            productName,
            category,
            barcode,
        });
        alert('Product added successfully!');
    };

    return (
        <div>
            <h2>Add New Product</h2>

            <div>
                <label>Barcode/QR Code</label>
                <input
                    type="text"
                    value={barcode}
                    onChange={(e) => setBarcode(e.target.value)}
                    placeholder="Scan or enter barcode"
                />
                <button onClick={handleScanBarcode}>
                    Scan Barcode/QR Code
                </button>
            </div>

            <div>
                <label>Product Name</label>
                <input
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                />
            </div>

            <div>
                <label>Category</label>
                <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                />
            </div>

            <button onClick={handleAddProduct}>Add Product</button>
        </div>
    );
}

export default AddNewAssets;
