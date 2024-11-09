import { useState, useEffect } from 'react';
import { getAllProducts, updateProductStockLevel } from './firebaseFunctions';

const StockManagementPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch all products on page load
        const fetchProducts = async () => {
            try {
                const productsData = await getAllProducts();
                setProducts(productsData);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching products:", error);
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const handleUpdateStockLevel = async (barcode) => {
        try {
            // Update the stock level based on quantity
            await updateProductStockLevel(barcode);
            // Fetch the updated list of products to reflect the stock level change
            const updatedProducts = await getAllProducts();
            setProducts(updatedProducts);
        } catch (error) {
            console.error("Error updating stock level:", error);
        }
    };

    return (
        <div>
            <h1>Stock Management</h1>
            {loading ? (
                <p>Loading products...</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Product Name</th>
                            <th>SKU</th>
                            <th>Quantity</th>
                            <th>Stock Level</th>
                            <th>Update Stock Level</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product.barcode}>
                                <td>{product.productName}</td>
                                <td>{product.sku}</td>
                                <td>{product.quantity}</td>
                                <td>{product.stockLevel || 'Not set'}</td>
                                <td>
                                    <button onClick={() => handleUpdateStockLevel(product.barcode)}>
                                        Update Stock Level
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default StockManagementPage;
