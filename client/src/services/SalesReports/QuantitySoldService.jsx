import { getDatabase, ref, get } from "firebase/database";

// Function to fetch and process the data
export const fetchSalesReportData = async (startDate, endDate) => {
    const db = getDatabase();
    const transactionsRef = ref(db, "TransactionHistory");
    let filteredData = [];
    let totalQty = 0;
    let totalRev = 0;
    let totalDisc = 0;
    let totalTax = 0;
    let netRev = 0;

    try {
        const snapshot = await get(transactionsRef);
        if (snapshot.exists()) {
            const transactions = snapshot.val();

            Object.keys(transactions).forEach((transactionId) => {
                const transaction = transactions[transactionId];
                const transactionDate = new Date(transaction.date);

                // Filter by date range
                if (
                    (!startDate || transactionDate >= new Date(startDate)) &&
                    (!endDate || transactionDate <= new Date(endDate))
                ) {
                    transaction.items.forEach(item => {
                        filteredData.push({
                            productName: item.productName,
                            totalQuantity: item.quantity,
                            price: parseFloat(item.price),
                            discount: parseFloat(transaction.discount),
                            tax: parseFloat(transaction.tax),
                            total: parseFloat(item.totalAmount),
                        });

                        totalQty += item.quantity;
                        totalRev += parseFloat(item.totalAmount);
                        totalDisc += parseFloat(transaction.discount);
                        totalTax += parseFloat(transaction.tax);
                    });
                }
            });

            netRev = totalRev - totalDisc + totalTax;
            return {
                filteredData,
                totalQuantity: totalQty,
                totalRevenue: totalRev,
                totalDiscount: totalDisc,
                totalTax,
                netRevenue: netRev,
            };
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    }

    return {
        filteredData,
        totalQuantity: 0,
        totalRevenue: 0,
        totalDiscount: 0,
        totalTax: 0,
        netRevenue: 0,
    };
};
