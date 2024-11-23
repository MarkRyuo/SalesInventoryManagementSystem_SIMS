/* eslint-disable no-case-declarations */
import { getDatabase, ref, get } from "firebase/database";

// Helper function to check if a transaction is in the selected range
const isInRange = (transactionDate, range, now) => {
    switch (range) {
        case "today":
            return transactionDate.toDateString() === now.toDateString();
        case "week":
            const startOfWeek = new Date(now);
            startOfWeek.setDate(now.getDate() - now.getDay());
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6);
            return transactionDate >= startOfWeek && transactionDate <= endOfWeek;
        case "month":
            return transactionDate.getMonth() === now.getMonth() && transactionDate.getFullYear() === now.getFullYear();
        case "year":
            return transactionDate.getFullYear() === now.getFullYear();
        default:
            return false;
    }
};

// Fetch and calculate Inventory Turnover
export const fetchInventoryTurnover = async (range) => {
    const db = getDatabase();
    const transactionHistoryRef = ref(db, "TransactionHistory");
    const productsRef = ref(db, "Products");

    try {
        const [transactionSnapshot, productsSnapshot] = await Promise.all([
            get(transactionHistoryRef),
            get(productsRef),
        ]);

        if (transactionSnapshot.exists() && productsSnapshot.exists()) {
            const transactions = transactionSnapshot.val();
            const products = productsSnapshot.val();

            const now = new Date();
            let totalSales = 0;
            Object.keys(transactions).forEach((transactionId) => {
                const transaction = transactions[transactionId];
                const transactionDate = new Date(transaction.date);

                if (isInRange(transactionDate, range, now)) {
                    totalSales += parseFloat(transaction.total);
                }
            });

            let currentInventoryValue = 0;
            Object.keys(products).forEach((productId) => {
                const product = products[productId];
                currentInventoryValue += parseFloat(product.price) * product.quantity;
            });

            const inventoryTurnover = currentInventoryValue > 0 ? totalSales / currentInventoryValue : 0;
            return inventoryTurnover.toFixed(2);
        } else {
            return 0; // No data found
        }
    } catch (error) {
        console.error("Error fetching inventory turnover:", error);
        throw error;
    }
};
