import { useEffect, useState } from 'react';
import { getAllProducts } from '../../../services/ProductService'; // Update with actual path to your functions file

function ProductEditor() {
    const [products, setProducts] = useState([]);

    // Fetch products on mount
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const productsList = await getAllProducts();
                setProducts(productsList);
            } catch (error) {
                console.error('Error fetching products:', error.message);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div>
            <h1>Product List</h1>
            {products.length > 0 ? (
                <ul>
                    {products.map((product) => (
                        <li key={product.barcode}>
                            <strong>{product.productName}</strong> - SKU: {product.sku} - Price: ${product.price} - Quantity: {product.quantity}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No products found.</p>
            )}
        </div>
    );
}

export default ProductEditor;
