import { useEffect, useState } from 'react';
import { getDatabase, ref, get } from "firebase/database";
import Chartcss from './Charts.module.scss';

function Chart4() {
    const [lowStockCount, setLowStockCount] = useState(0);

    // Fetch low stock products
    useEffect(() => {
        const fetchLowStock = async () => {
            try {
                const db = getDatabase();
                const productsRef = ref(db, 'products');
                const snapshot = await get(productsRef);

                if (!snapshot.exists()) {
                    console.log("No products found.");
                    setLowStockCount(0);
                    return;
                }

                const products = snapshot.val();

                const lowStockProducts = Object.keys(products).map(key => {
                    const product = products[key];

                    // Skip invalid product entries
                    if (typeof product !== 'object' || Array.isArray(product) || !product) {
                        console.warn(`Skipping invalid product data at key: ${key}`);
                        return null;
                    }

                    const { stockNumber, threshold } = product;

                    // Ensure numeric values and calculate low stock
                    const stock = parseInt(stockNumber) || 0;
                    const lowStockThreshold = Math.ceil((parseInt(threshold) || 0) / 4);

                    // Check if stock is below threshold
                    if (stock <= lowStockThreshold) {
                        return { ...product, lowStockThreshold };
                    }

                    return null;
                }).filter(product => product !== null);

                setLowStockCount(lowStockProducts.length);
            } catch (error) {
                console.error("Failed to fetch low stock products:", error);
            }
        };

        fetchLowStock();
    }, []);

    return (
        <div className={Chartcss.containerChart4}>
            <h5>Low Stock</h5>
            <div className={Chartcss.contentChart4}>
                <p>{lowStockCount}</p>
            </div>
        </div>
    );
}

export default Chart4;
