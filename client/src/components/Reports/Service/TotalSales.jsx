import { getDatabase, ref, get } from 'firebase/database';

// Fetch transactions from Firebase
export const fetchTransactions = async () => {
    const db = getDatabase();
    const transactionRef = ref(db, 'TransactionHistory');

    try {
        const snapshot = await get(transactionRef);
        if (snapshot.exists()) {
            const transactions = snapshot.val();
            // Transform the data to match the format used in your table
            return Object.keys(transactions).map(key => {
                const transaction = transactions[key];

                // Ensure each field is properly parsed as a number
                return {
                    transactionId: key, // The key itself is the transaction ID
                    date: transaction.date,
                    totalQuantity: Number(transaction.totalQuantity) || 0,  // Parse as number, default to 0 if invalid
                    discount: Number(transaction.discount) || 0,  // Parse as number, default to 0 if invalid
                    tax: Number(transaction.tax) || 0,  // Parse as number, default to 0 if invalid
                    total: Number(transaction.total) || 0,  // Parse as number, default to 0 if invalid
                };
            });
        } else {
            return []; // If no data is found
        }
    } catch (error) {
        console.error('Error fetching transaction data:', error);
        return [];
    }
};
