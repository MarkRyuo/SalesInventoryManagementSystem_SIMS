/* eslint-disable no-case-declarations */
import { getDatabase, ref, get } from "firebase/database";

// Helper function to calculate if a transaction is within a specific date range
const isTransactionInRange = (transactionDate, range) => {
    const now = new Date();
    const transactionTime = new Date(transactionDate);

    switch (range) {
        case 'today':
            // For today, check if the transaction's date is today and the time is between 8 AM and 9 PM
            const startOfDay = new Date(now);
            startOfDay.setHours(8, 0, 0, 0); // Set to 8:00 AM
            const endOfDay = new Date(now);
            endOfDay.setHours(21, 0, 0, 0); // Set to 9:00 PM

            return transactionTime >= startOfDay && transactionTime <= endOfDay;

        case 'week':
            // Calculate the start of the current week (Sunday)
            const startOfWeek = new Date(now);
            startOfWeek.setDate(now.getDate() - now.getDay()); // Set to Sunday
            startOfWeek.setHours(0, 0, 0, 0); // Reset time to 00:00

            // Calculate the end of the week (Saturday)
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6); // Saturday
            endOfWeek.setHours(23, 59, 59, 999); // Set to the last millisecond of Saturday

            // Check if the transaction date is within the range of this week
            return transactionTime >= startOfWeek && transactionTime <= endOfWeek;

        case 'month':
            // Check if the transaction is in the current month and year
            return transactionTime.getMonth() === now.getMonth() && transactionTime.getFullYear() === now.getFullYear();

        case 'year':
            // Check if the transaction is in the current year
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
