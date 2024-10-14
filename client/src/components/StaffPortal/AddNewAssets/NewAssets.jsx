import { useState } from 'react';

function AddNewAssets() {
    const [barcode, setBarcode] = useState('This is code');
    const [productName, setProductName] = useState('');
    const [category, setCategory] = useState('');
    const [newCategory, setNewCategory] = useState('');
    const [categories, setCategories] = useState(['Electronics', 'Furniture', 'Toys']);
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [isBox, setIsBox] = useState(false);

    const handleAddProduct = () => {
        // Logic for adding a new product goes here
        const productDetails = {
            barcode,
            productName,
            category: category || newCategory,
            price,
            quantity,
            isBox,
        };
        console.log(productDetails);
        alert('Product added successfully!');
    };

    const handleAddCategory = () => {
        if (newCategory && !categories.includes(newCategory)) {
            setCategories([...categories, newCategory]);
            setCategory(newCategory);
            setNewCategory('');
            alert('New category added!');
        }
    };

    return (
        <div>
            <h2>Add New Product</h2>

            <div>
                <label>QR Code/Barcode Value:</label>
                <input
                    type="text"
                    value={barcode}
                    readOnly
                />
                <button onClick={() => alert('Scanner opened')}>
                    Scan Barcode/QR Code
                </button>
            </div>

            <div>
                <label>Product Name:</label>
                <input
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                />
            </div>

            <div>
                <label>Category:</label>
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                >
                    <option value="">Select a category</option>
                    {categories.map((cat, index) => (
                        <option key={index} value={cat}>
                            {cat}
                        </option>
                    ))}
                </select>
                <input
                    type="text"
                    placeholder="Add new category"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                />
                <button onClick={handleAddCategory}>Add Category</button>
            </div>

            <div>
                <label>Price:</label>
                <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                />
            </div>

            <div>
                <label>Quantity:</label>
                <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                />
            </div>

            <div>
                <label>
                    <input
                        type="checkbox"
                        checked={isBox}
                        onChange={(e) => setIsBox(e.target.checked)}
                    />
                    This product is sold as a box
                </label>
                {isBox && (
                    <p>
                        Quantity per box: {quantity}
                    </p>
                )}
            </div>

            <button onClick={handleAddProduct}>Add Product</button>
        </div>
    );
}

export default AddNewAssets;
