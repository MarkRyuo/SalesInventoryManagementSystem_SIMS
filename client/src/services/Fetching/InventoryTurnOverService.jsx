/* eslint-disable no-case-declarations */
import { getDatabase, ref, get } from "firebase/database";

// Modify 'isInRange' to accept 'now' as a parameter
const isInRange = (transactionDate, range, now) => {
    switch (range) {
        case "month":
            return transactionDate.getMonth() === now.getMonth() && transactionDate.getFullYear() === now.getFullYear();
        case "quarter":
            const currentQuarter = Math.floor((now.getMonth() + 3) / 3);
            const transactionQuarter = Math.floor((transactionDate.getMonth() + 3) / 3);
            return transactionDate.getFullYear() === now.getFullYear() && transactionQuarter === currentQuarter;
        case "year":
            return transactionDate.getFullYear() === now.getFullYear();
        default:
            return false;
    }
};

export const fetchInventoryTurnover = async (range, now) => {
    const db = getDatabase();
    const transactionHistoryRef = ref(db, "TransactionHistory");
    const productsRef = ref(db, "products");

    try {
        const [transactionSnapshot, productsSnapshot] = await Promise.all([
            get(transactionHistoryRef),
            get(productsRef),
        ]);

        if (transactionSnapshot.exists() && productsSnapshot.exists()) {
            const transactions = transactionSnapshot.val();
            const products = productsSnapshot.val();

            // Variables to store total sales and inventory values
            let totalSales = 0;
            let beginningInventoryValue = 0;
            let endingInventoryValue = 0;

            // Calculate total sales (COGS)
            Object.keys(transactions).forEach((transactionId) => {
                const transaction = transactions[transactionId];
                const transactionDate = new Date(Date.parse(transaction.date));

                if (isInRange(transactionDate, range, now)) { // now is passed to 'isInRange'
                    totalSales += parseFloat(transaction.total); // Sum of all transactions in range
                }
            });

            // Calculate Beginning Inventory (for the first day of the selected range)
            Object.keys(products).forEach((productId) => {
                const product = products[productId];
                beginningInventoryValue += parseFloat(product.price) * parseInt(product.quantity); // Initial stock value
            });

            // Calculate Ending Inventory (latest available inventory at the end of the selected range)
            Object.keys(products).forEach((productId) => {
                const product = products[productId];
                endingInventoryValue += parseFloat(product.price) * parseInt(product.quantity); // Current stock value
            });

            // Calculate Average Inventory
            const averageInventory = (beginningInventoryValue + endingInventoryValue) / 2;

            // Calculate Inventory Turnover
            const inventoryTurnover = averageInventory > 0 ? totalSales / averageInventory : 0;

            console.log("Total Sales (COGS):", totalSales);
            console.log("Beginning Inventory Value:", beginningInventoryValue);
            console.log("Ending Inventory Value:", endingInventoryValue);
            console.log("Average Inventory:", averageInventory);
            console.log("Inventory Turnover:", inventoryTurnover.toFixed(2));

            return inventoryTurnover.toFixed(2);
        } else {
            console.log("No data found in TransactionHistory or Products.");
            return 0;
        }
    } catch (error) {
        console.error("Error fetching inventory turnover:", error);
        throw error;
    }
};