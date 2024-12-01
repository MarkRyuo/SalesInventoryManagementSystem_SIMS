/* eslint-disable no-case-declarations */
import { getDatabase, ref, get } from "firebase/database";

// Helper function to calculate if a transaction is within a specific date range
const isTransactionInRange = (transactionDate, range) => {
    const now = new Date();
    const transactionTime = new Date(transactionDate);

    // Create a copy of 'now' for calculations
    const currentDate = new Date(now);

    switch (range) {
        case 'today':
            return transactionTime.toDateString() === currentDate.toDateString();
        case 'week':
            const startOfWeek = new Date(currentDate);
            startOfWeek.setDate(currentDate.getDate() - currentDate.getDay()); // Sunday
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6); // Saturday
            return transactionTime >= startOfWeek && transactionTime <= endOfWeek;
        case 'month':
            return transactionTime.getMonth() === currentDate.getMonth() && transactionTime.getFullYear() === currentDate.getFullYear();
        case 'year':
            return transactionTime.getFullYear() === currentDate.getFullYear();
        default:
            return false;
    }
};


export const fetchTotalSales = async (range) => {
    const db = getDatabase();
    const transactionHistoryRef = ref(db, 'TransactionHistory');
    let totalSales = 0;

    try {
        const snapshot = await get(transactionHistoryRef);
        if (snapshot.exists()) {
            const transactions = snapshot.val();
            Object.keys(transactions).forEach(transactionId => {
                const transaction = transactions[transactionId];
                const transactionDate = transaction.date;
                const totalAmount = parseFloat(transaction.total);  // Assuming 'total' is a string and converting to number

                if (isTransactionInRange(transactionDate, range)) {
                    totalSales += totalAmount;
                }
            });

            // Return the formatted total sales as PHP currency
            return totalSales.toLocaleString('en-PH', {
                style: 'currency',
                currency: 'PHP'
            });
        } else {
            return '₱0.00';  // Return a default formatted value if no data found
        }
    } catch (error) {
        console.error("Error fetching transactions:", error);
        throw new Error(`Error fetching transactions: ${error.message}`);
    }
};

