// stockHelpers.js
import { getDatabase, ref, get } from "firebase/database";

// Fetch stock in by date range
export const fetchStockInByDate = async (startDate, endDate) => {
    const db = getDatabase();
    const productsRef = ref(db, "products");

    try {
        const snapshot = await get(productsRef);
        if (snapshot.exists()) {
            const products = snapshot.val();
            let filteredData = [];

            Object.keys(products).forEach((productId) => {
                const product = products[productId];
                const addedQuantityHistory = product.addedQuantityHistory;

                Object.keys(addedQuantityHistory).forEach((key) => {
                    const entry = addedQuantityHistory[key];
                    const entryDate = new Date(entry.date); // Assuming entry.date is a valid timestamp

                    // Parse the start and end dates to Date objects
                    const startDateObj = new Date(startDate);
                    const endDateObj = new Date(endDate);

                    // Check if the entry date falls within the range (inclusive)
                    if (entryDate >= startDateObj && entryDate <= endDateObj) {
                        filteredData.push({
                            productId,
                            productName: product.productName,
                            barcode: product.barcode,
                            sku: product.sku,
                            addedQuantityHistory: entry,
                            price: product.price,
                        });
                    }
                });
            });

            return filteredData;
        } else {
            return [];
        }
    } catch (error) {
        console.error("Error fetching stock data by date:", error);
        throw new Error("Error fetching stock data by date.");
    }
};


// Fetch all stock data
export const fetchAllStockIn = async () => {
    const db = getDatabase();
    const productsRef = ref(db, "products");

    try {
        const snapshot = await get(productsRef);
        if (snapshot.exists()) {
            const products = snapshot.val();
            let allData = [];

            Object.keys(products).forEach((productId) => {
                const product = products[productId];
                const addedQuantityHistory = product.addedQuantityHistory;

                Object.keys(addedQuantityHistory).forEach((key) => {
                    const entry = addedQuantityHistory[key];
                    allData.push({
                        productId,
                        productName: product.productName,
                        barcode: product.barcode,
                        sku: product.sku,
                        addedQuantityHistory: entry,
                        price: product.price,
                    });
                });
            });

            return allData;
        } else {
            return [];
        }
    } catch (error) {
        console.error("Error fetching all stock data:", error);
        throw new Error("Error fetching all stock data.");
    }
};