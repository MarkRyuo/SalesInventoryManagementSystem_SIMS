// stockHelpers.js
import { getDatabase, ref, get } from "firebase/database";

// Fetch total stock overview
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
                totalStock += product.quantity;
            });
            return totalStock;
        } else {
            console.log("No products found.");
            return 0;
        }
    } catch (error) {
        console.error("Error fetching stock in overview:", error);
        throw new Error("Error fetching stock in overview.");
    }
};

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
                    const entryDate = new Date(entry.date);
                    if (entryDate >= new Date(startDate) && entryDate <= new Date(endDate)) {
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