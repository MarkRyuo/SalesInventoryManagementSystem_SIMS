import { getDatabase, ref, get } from "firebase/database";
import moment from "moment"; // For date formatting and comparison

const fetchSalesReport = async (startDate, endDate) => {
    const db = getDatabase();
    const transactionHistoryRef = ref(db, 'TransactionHistory');

    // Filter transactions by date range
    const transactionsSnapshot = await get(transactionHistoryRef);
    const transactions = transactionsSnapshot.val();

    if (!transactions) return [];

    // Prepare the filtered transactions
    const filteredTransactions = Object.values(transactions).filter(transaction => {
        const transactionDate = moment(transaction.date, "MM/DD/YYYY, h:mm:ss A"); // Format date
        return transactionDate.isBetween(startDate, endDate, null, '[]');
    });

    // Initialize report data
    let reportData = {
        title: `Sales Report - From: ${moment(startDate).format("MMMM D, YYYY")} To: ${moment(endDate).format("MMMM D, YYYY")}`,
        filter: `Products sold from ${moment(startDate).format("MMMM YYYY")}`,
        products: [],
        totalQuantitySold: 0,
        totalRevenue: 0,
        totalDiscountsApplied: 0,
        netRevenue: 0,
        totalTax: 0
    };

    // Process the transactions
    filteredTransactions.forEach(transaction => {
        const items = transaction.items;

        items.forEach(item => {
            const productName = item.productName;
            const quantitySold = item.quantity;
            const unitPrice = parseFloat(item.unitPrice);
            const totalSales = quantitySold * unitPrice;

            // Check if product already exists in report data
            let product = reportData.products.find(p => p.productName === productName);
            if (!product) {
                product = {
                    productName,
                    totalQuantity: 0,
                    unitPrice,
                    totalSales: 0
                };
                reportData.products.push(product);
            }

            // Update product details
            product.totalQuantity += quantitySold;
            product.totalSales += totalSales;

            // Update overall summary
            reportData.totalQuantitySold += quantitySold;
            reportData.totalRevenue += totalSales;
            reportData.totalDiscountsApplied += parseFloat(transaction.discount);
            reportData.netRevenue += totalSales - parseFloat(transaction.discount) + parseFloat(transaction.tax);
            reportData.totalTax += parseFloat(transaction.tax);
        });
    });

    return reportData;
};

// Example usage:
const startDate = moment("2024-11-01", "YYYY-MM-DD");
const endDate = moment("2024-11-30", "YYYY-MM-DD");

fetchSalesReport(startDate, endDate).then(reportData => {
    console.log(reportData);
});
