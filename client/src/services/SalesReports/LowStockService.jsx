import { getDatabase, ref, get } from "firebase/database";

// Fetch low stock products within a date range
export const fetchLowStockData = async (startDate, endDate) => {
    const db = getDatabase();
    const productsRef = ref(db, "products");
    let lowStockData = [];

    try {
        const snapshot = await get(productsRef);
        if (snapshot.exists()) {
            const products = snapshot.val();

            // Loop through all products to filter low stock based on threshold and date
            Object.keys(products).forEach((productId) => {
                const product = products[productId];

                // Calculate low stock threshold as 1/4 of the instockthreshold
                const threshold = product.instockthreshold;
                const lowStockThreshold = threshold / 4;

                // Loop through addedQuantityHistory to check for date range
                product.addedQuantityHistory.forEach((history) => {
                    const historyDate = new Date(history.date);
                    const historyQuantity = history.quantity;

                    // Filter by date range and low stock condition (quantity <= 1/4 of threshold)
                    if (
                        historyQuantity <= lowStockThreshold &&
                        (!startDate || historyDate >= new Date(startDate)) &&
                        (!endDate || historyDate <= new Date(endDate))
                    ) {
                        lowStockData.push({
                            productName: product.productName,
                            sku: product.sku,
                            barcode: product.barcode,
                            quantity: historyQuantity,
                            instockthreshold: threshold,
                            status: "Low Stock",
                            date: history.date,
                        });
                    }
                });
            });
        }
    } catch (error) {
        console.error("Error fetching low stock data:", error);
    }

    return lowStockData;
};
