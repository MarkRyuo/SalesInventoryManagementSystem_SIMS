import { getDatabase, ref, get } from "firebase/database";

// Helper function to calculate if a transaction is within a specific date range
const isTransactionInRange = (transactionDate, startDate, endDate) => {
    const transactionTime = new Date(transactionDate);
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Check if the transaction date is within the range
    return transactionTime >= start && transactionTime <= end;
};

export const fetchSalesData = async (startDate, endDate) => {
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

                if (isTransactionInRange(transactionDate, startDate, endDate)) {
                    salesData.totalQuantity.push(quantity);  // Add to total quantity
                    salesData.totalSales.push(totalAmount);  // Add to total sales amount
                }
            });

            console.log(`Sales Data from ${startDate} to ${endDate}:`, salesData);
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
