import { getDatabase, ref, get, query, orderByChild, startAt, endAt } from "firebase/database";

async function fetchTotalSalesReport(startDate, endDate) {
    const db = getDatabase();
    const transactionsRef = ref(db, 'TransactionHistory');

    const formattedStartDate = new Date(startDate).getTime(); // Convert to timestamp
    const formattedEndDate = new Date(endDate).getTime(); // Convert to timestamp

    const salesQuery = query(transactionsRef, orderByChild("date"), startAt(formattedStartDate), endAt(formattedEndDate));

    try {
        const snapshot = await get(salesQuery);
        if (snapshot.exists()) {
            const data = snapshot.val();
            return Object.entries(data).map(([id, details]) => ({
                id,
                date: details.date,
                totalQuantity: details.totalQuantity,
                discount: details.discount,
                tax: details.tax,
                total: details.total,
            }));
        }
        return [];
    } catch (error) {
        console.error("Error fetching transactions:", error);
        throw error;
    }
}
