import { getDatabase, ref, get } from "firebase/database";

// Helper function to calculate if a transaction is within a specific date range
const isTransactionInRange = (transactionDate, range) => {
    const now = new Date();
    const transactionTime = new Date(transactionDate);

    switch (range) {
        case 'today':
            return transactionTime.toDateString() === now.toDateString();
        case 'week':
            { const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay())); // Sunday
            return transactionTime >= startOfWeek && transactionTime <= now; }
        case 'month':
            return transactionTime.getMonth() === now.getMonth() && transactionTime.getFullYear() === now.getFullYear();
        case 'year':
            return transactionTime.getFullYear() === now.getFullYear();
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
            console.log(`Total Sales for ${range}:`, totalSales);
            return totalSales;
        } else {
            console.log("No transactions found.");
            return 0;  // No data found
        }
    } catch (error) {
        console.error("Error fetching transactions:", error);
        throw new Error(`Error fetching transactions: ${error.message}`);
    }
};
