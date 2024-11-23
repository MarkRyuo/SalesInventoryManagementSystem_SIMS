import { getDatabase, ref, get } from "firebase/database";

// Helper function to calculate if a transaction is within a specific date range
const isTransactionInRange = (transactionDate, range) => {
    const now = new Date();
    const transactionTime = new Date(transactionDate);

    switch (range) {
        case 'today':
            return transactionTime.toDateString() === now.toDateString();
        case 'week':
            // eslint-disable-next-line no-case-declarations
            const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay())); // Sunday
            return transactionTime >= startOfWeek && transactionTime <= now;
        case 'month':
            return transactionTime.getMonth() === now.getMonth() && transactionTime.getFullYear() === now.getFullYear();
        case 'year':
            return transactionTime.getFullYear() === now.getFullYear();
        default:
            return false;
    }
};

export const fetchSalesData = async (range) => {
    const db = getDatabase();
    const transactionHistoryRef = ref(db, 'TransactionHistory');
    const salesData = { totalQuantity: [], totalSales: [] };

    try {
        const snapshot = await get(transactionHistoryRef);
        if (snapshot.exists()) {
            const transactions = snapshot.val();

            // Loop through each transaction to filter and aggregate the sales data
            Object.keys(transactions).forEach(transactionId => {
                const transaction = transactions[transactionId];
                const transactionDate = transaction.date;
                const totalAmount = parseFloat(transaction.total); // Get total amount (sales)
                const quantity = transaction.totalQuantity; // Get total quantity sold

                if (isTransactionInRange(transactionDate, range)) {
                    salesData.totalQuantity.push(quantity);  // Add to total quantity
                    salesData.totalSales.push(totalAmount);  // Add to total sales amount
                }
            });

            console.log(`Sales Data for ${range}:`, salesData);
            return salesData;
        } else {
            console.log("No transactions found.");
            return salesData;  // Return empty data if no transactions
        }
    } catch (error) {
        console.error("Error fetching transactions:", error);
        throw new Error(`Error fetching transactions: ${error.message}`);
    }
};
