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

            // Loop through all transactions to filter by date range and calculate totals
            Object.keys(transactions).forEach((transactionId) => {
                const transaction = transactions[transactionId];
                const transactionDate = new Date(transaction.date);

                // Filter by date range
                if (
                    (!startDate || transactionDate >= new Date(startDate)) &&
                    (!endDate || transactionDate <= new Date(endDate))
                ) {
                    // Loop through all items in the transaction
                    transaction.items.forEach(item => {
                        const totalAmount = parseFloat(item.totalAmount) || 0;
                        filteredData.push({
                            productName: item.productName,
                            totalQuantity: item.quantity,
                            price: parseFloat(item.price) || 0,
                            discount: parseFloat(transaction.discount) || 0,
                            tax: parseFloat(transaction.tax) || 0,
                            total: totalAmount,
                        });

                        totalQty += item.quantity;
                        totalRev += totalAmount; // Make sure it's correctly parsed
                        totalDisc += parseFloat(transaction.discount) || 0;
                        totalTax += parseFloat(transaction.tax) || 0;
                    });

                    // Calculate net revenue only after the loop
                    netRev = totalRev - totalDisc + totalTax;

                    console.log("Total Revenue:", totalRev);
                    console.log("Total Discount:", totalDisc);
                    console.log("Total Tax:", totalTax);
                    console.log("Net Revenue:", netRev);
                }
            });

            // Calculate net revenue (Total Revenue - Discount + Tax)
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

    // Return default values in case of error or empty data
    return {
        filteredData,
        totalQuantity: 0,
        totalRevenue: 0,
        totalDiscount: 0,
        totalTax: 0,
        netRevenue: 0,
    };
};
