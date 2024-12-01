/* eslint-disable no-case-declarations */
import { getDatabase, ref, get } from "firebase/database";

// Helper function to calculate if a transaction is within a specific date range
const isTransactionInRange = (transactionDate, range) => {
    const now = new Date();
    const transactionTime = new Date(transactionDate);

    // Strip the time from the dates for comparison
    const transactionDay = transactionTime.toISOString().split('T')[0]; // Format as 'YYYY-MM-DD'
    const currentDay = now.toISOString().split('T')[0]; // Format as 'YYYY-MM-DD'

    switch (range) {
        case 'today':
            // For today, check if the transaction's date is today
            return transactionDay === currentDay;

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
            // This ensures the transaction is in November and December
            const transactionYear = transactionTime.getFullYear();
            const currentYear = now.getFullYear();

            // If the transaction year matches the current year, return true
            return transactionYear === currentYear;

        default:
            return false;
    }
};


export const fetchSalesData = async (range) => {
    const db = getDatabase();
    const transactionHistoryRef = ref(db, 'TransactionHistory');
    const salesData = { totalSales: [], totalQuantity: [], dates: [] };

    // Define the time slots
    const timeSlots = [
        { label: '7AM-9AM', start: 7, end: 9 },
        { label: '9AM-11AM', start: 9, end: 11 },
        { label: '11AM-1PM', start: 11, end: 13 },
        { label: '1PM-3PM', start: 13, end: 15 },
        { label: '3PM-6PM', start: 15, end: 18 },
    ];

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

                // Get the date and time of transaction for further processing
                const transactionTime = new Date(transactionDate);
                const transactionHour = transactionTime.getHours(); // Hour of the transaction

                // Check if the transaction is within the selected range
                if (isTransactionInRange(transactionDate, range)) {
                    // For Today range, aggregate by custom time slots
                    if (range === 'today') {
                        const timeSlotIndex = timeSlots.findIndex(slot =>
                            transactionHour >= slot.start && transactionHour < slot.end
                        );

                        if (timeSlotIndex !== -1) {
                            if (!salesData.totalSales[timeSlotIndex]) {
                                salesData.totalSales[timeSlotIndex] = 0;
                                salesData.totalQuantity[timeSlotIndex] = 0;
                            }

                            salesData.totalSales[timeSlotIndex] += totalAmount;
                            salesData.totalQuantity[timeSlotIndex] += quantity;

                            if (!salesData.dates[timeSlotIndex]) {
                                salesData.dates[timeSlotIndex] = timeSlots[timeSlotIndex].label;
                            }
                        }
                    }

                    // For Week range, aggregate by days of the week
                    if (range === 'week') {
                        const dayOfWeek = transactionTime.toLocaleString('default', { weekday: 'long' });
                        const dayIndex = salesData.dates.indexOf(dayOfWeek);
                        if (dayIndex === -1) {
                            salesData.dates.push(dayOfWeek);
                            salesData.totalSales.push(totalAmount);
                            salesData.totalQuantity.push(quantity);
                        } else {
                            salesData.totalSales[dayIndex] += totalAmount;
                            salesData.totalQuantity[dayIndex] += quantity;
                        }
                    }

                    // For Month range, merge the sales data from the weeks
                    if (range === 'month') {
                        const weekIndex = Math.floor(transactionTime.getDate() / 7); // Determine which week the transaction belongs to
                        if (!salesData.dates[weekIndex]) {
                            salesData.dates[weekIndex] = `Week ${weekIndex + 1}`;
                            salesData.totalSales[weekIndex] = totalAmount;
                            salesData.totalQuantity[weekIndex] = quantity;
                        } else {
                            salesData.totalSales[weekIndex] += totalAmount;
                            salesData.totalQuantity[weekIndex] += quantity;
                        }
                    }

                    // For Year range, merge the sales data from the months
                    if (range === 'year') {
                        const monthIndex = transactionTime.getMonth(); // Get the month of the transaction
                        if (!salesData.dates[monthIndex]) {
                            salesData.dates[monthIndex] = new Date(transactionTime).toLocaleString('default', { month: 'short' });
                            salesData.totalSales[monthIndex] = totalAmount;
                            salesData.totalQuantity[monthIndex] = quantity;
                        } else {
                            salesData.totalSales[monthIndex] += totalAmount;
                            salesData.totalQuantity[monthIndex] += quantity;
                        }
                    }
                }
            });

            // For the month range, sum up all weekly sales to get the total sales for the month
            if (range === 'month') {
                const totalMonthSales = salesData.totalSales.reduce((acc, curr) => acc + curr, 0);
                const totalMonthQuantity = salesData.totalQuantity.reduce((acc, curr) => acc + curr, 0);
                salesData.totalSales = [totalMonthSales];  // Merged total sales for the whole month
                salesData.totalQuantity = [totalMonthQuantity];  // Merged total quantity for the whole month
                salesData.dates = ['Month Total'];  // Single entry for the total month
            }

            // For the year range, sum up all monthly sales to get the total sales for the year
            if (range === 'year') {
                const totalYearSales = salesData.totalSales.reduce((acc, curr) => acc + curr, 0);
                const totalYearQuantity = salesData.totalQuantity.reduce((acc, curr) => acc + curr, 0);
                salesData.totalSales = [totalYearSales];  // Merged total sales for the whole year
                salesData.totalQuantity = [totalYearQuantity];  // Merged total quantity for the whole year
                salesData.dates = ['Year Total'];  // Single entry for the total year
            }

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





