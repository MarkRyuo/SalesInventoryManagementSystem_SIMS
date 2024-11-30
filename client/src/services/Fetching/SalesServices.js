/* eslint-disable no-case-declarations */
import { getDatabase, ref, get } from "firebase/database";

// Helper function to calculate if a transaction is within a specific date range
const isTransactionInRange = (transactionDate, range) => {
    const now = new Date();
    const transactionTime = new Date(transactionDate);

    switch (range) {
        case 'today':
            return transactionTime.toDateString() === now.toDateString();
        case 'week':
            const startOfWeek = new Date(now);
            startOfWeek.setDate(now.getDate() - now.getDay());
            startOfWeek.setHours(0, 0, 0, 0);

            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6);
            endOfWeek.setHours(23, 59, 59, 999);

            return transactionTime >= startOfWeek && transactionTime <= endOfWeek;
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
    const salesData = { totalSales: [] };  // Removed totalQuantity

    try {
        const snapshot = await get(transactionHistoryRef);
        if (snapshot.exists()) {
            const transactions = snapshot.val();

            Object.keys(transactions).forEach(transactionId => {
                const transaction = transactions[transactionId];
                const transactionDate = transaction.date;
                const totalAmount = parseFloat(transaction.total);

                if (isTransactionInRange(transactionDate, range)) {
                    salesData.totalSales.push(totalAmount);  // Only adding total sales amount
                }
            });

            console.log(`Sales Data for ${range}:`, salesData);
            return salesData;
        } else {
            console.log("No transactions found.");
            return salesData;
        }
    } catch (error) {
        console.error("Error fetching transactions:", error);
        throw new Error(`Error fetching transactions: ${error.message}`);
    }
};
