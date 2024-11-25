import { getDatabase, ref, get, query, orderByChild } from "firebase/database";

export function fetchTotalSalesReport(startDate, endDate) {
    const db = getDatabase();
    const transactionsRef = ref(db, 'TransactionHistory');

    const formattedStartDate = new Date(startDate).getTime(); // Convert to timestamp
    const formattedEndDate = new Date(endDate).getTime(); // Convert to timestamp

    const salesQuery = query(transactionsRef, orderByChild("date"));

    return get(salesQuery)
        .then(snapshot => {
            if (snapshot.exists()) {
                const data = snapshot.val();

                // Filter dates manually
                const filteredData = Object.entries(data).filter(([id, details]) => {
                    const transactionDate = new Date(details.date).getTime();
                    return transactionDate >= formattedStartDate && transactionDate <= formattedEndDate;
                });

                return filteredData.map(([id, details]) => ({
                    id, // TransactionHistory key
                    date: details.date,
                    totalQuantity: details.totalQuantity,
                    discount: details.discount,
                    tax: details.tax,
                    total: details.total,
                }));
            }
            return [];
        })
        .catch(error => {
            console.error("Error fetching transactions:", error);
            throw error;
        });
}
