/* eslint-disable no-case-declarations */
import { getDatabase, ref, get } from "firebase/database";


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

export const fetchInventoryTurnover = async (range) => {
    const db = getDatabase();
    const transactionHistoryRef = ref(db, "TransactionHistory");
    const productsRef = ref(db, "products");

    try {
        const [transactionSnapshot, productsSnapshot] = await Promise.all([
            get(transactionHistoryRef),
            get(productsRef),
        ]);

        console.log("Transaction Snapshot:", transactionSnapshot.val());
        console.log("Products Snapshot:", productsSnapshot.val());

        if (transactionSnapshot.exists() && productsSnapshot.exists()) {
            const transactions = transactionSnapshot.val();
            const products = productsSnapshot.val();

            const now = new Date();

            // Variables to store total sales and inventory values
            let totalSales = 0;
            let beginningInventoryValue = 0;
            let endingInventoryValue = 0;

            // Calculate total sales (COGS) and gather inventory values for average calculation
            Object.keys(transactions).forEach((transactionId) => {
                const transaction = transactions[transactionId];
                const transactionDate = new Date(Date.parse(transaction.date));

                if (isInRange(transactionDate, range, now)) {
                    totalSales += parseFloat(transaction.total);
                }
            });

            // Calculate Beginning Inventory (for the first day of the selected range)
            // Assuming the beginning inventory is fetched from the `products` data at the start of the range
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

