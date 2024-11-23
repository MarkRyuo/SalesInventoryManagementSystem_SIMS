import { getDatabase, ref, get } from "firebase/database";

// Fetch total sales from the database
export const fetchTotalSales = async (startDate, endDate) => {
    const db = getDatabase();
    const transactionsRef = ref(db, "TransactionHistory");

    try {
        const snapshot = await get(transactionsRef);
        if (snapshot.exists()) {
            const transactions = snapshot.val();
            const filteredTransactions = [];
            let totalSales = 0;

            Object.keys(transactions).forEach((transactionId) => {
                const transaction = transactions[transactionId];
                const transactionDate = new Date(transaction.date);

                if (
                    (!startDate || transactionDate >= new Date(startDate)) &&
                    (!endDate || transactionDate <= new Date(endDate))
                ) {
                    filteredTransactions.push({
                        id: transactionId,
                        ...transaction,
                    });
                    totalSales += parseFloat(transaction.total);
                }
            });

            return { filteredTransactions, totalSales };
        } else {
            return { filteredTransactions: [], totalSales: 0 };
        }
    } catch (error) {
        console.error("Error fetching total sales:", error);
        throw new Error("Failed to fetch total sales.");
    }
};
