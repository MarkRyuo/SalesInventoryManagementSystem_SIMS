import { getDatabase, ref, get } from "firebase/database";

// Fetch StockIn Overview
export const fetchStockInOverview = async () => {
    const db = getDatabase();
    const productsRef = ref(db, "products");

    try {
        const snapshot = await get(productsRef);
        if (snapshot.exists()) {
            const products = snapshot.val();
            let totalStock = 0;

            Object.keys(products).forEach((productId) => {
                const product = products[productId];
                totalStock += product.quantity; // Summing up all the stock quantities
            });

            return totalStock; // Returns the total stock count
        } else {
            console.log("No products found.");
            return 0; // If no products, return 0
        }
    } catch (error) {
        console.error("Error fetching stock in overview:", error);
        throw new Error("Error fetching stock in overview.");
    }
};
