import Chartcss from './Charts.module.scss';
import { FaReact } from "react-icons/fa";
import { useState, useEffect, useCallback } from "react";
import { getDatabase, ref, get } from "firebase/database"; // Firebase imports

function Chart2() {
    const [totalSales, setTotalSales] = useState(0);
    const [timeRange, setTimeRange] = useState("Today"); // Default to 'Today' for time range

    // Function to calculate the date range based on the selected time range
    const calculateDateRange = useCallback(() => {
        const today = new Date();
        const philippineOffset = 8 * 60; // UTC +8 offset in minutes
        const localTime = new Date(today.getTime() + (philippineOffset - today.getTimezoneOffset()) * 60000);

        // Get the start of the current day in Philippine time
        const startOfDay = new Date(localTime.getFullYear(), localTime.getMonth(), localTime.getDate());
        let startDate, endDate;

        switch (timeRange) {
            case "Today":
                startDate = startOfDay;
                endDate = localTime;
                break;
            case "7 Days":
                startDate = new Date(startOfDay.getTime() - 6 * 24 * 60 * 60 * 1000); // Include today
                endDate = localTime;
                break;
            case "Month":
                startDate = new Date(localTime.getFullYear(), localTime.getMonth(), 1); // Start of the month
                endDate = new Date(localTime.getFullYear(), localTime.getMonth() + 1, 0); // Last day of the month
                break;
            case "Year":
                startDate = new Date(localTime.getFullYear(), 0, 1); // Start of the year
                endDate = new Date(localTime.getFullYear(), 11, 31); // Last day of the year
                break;
            default:
                startDate = startOfDay;
                endDate = localTime;
        }

        return { startDate, endDate };
    }, [timeRange]);

    // Function to fetch sales data
    const fetchSalesData = useCallback(async () => {
        const db = getDatabase();
        const ordersRef = ref(db, "TransactionHistory"); // Reference to the TransactionHistory node

        try {
            const snapshot = await get(ordersRef);
            if (!snapshot.exists()) {
                console.log("No sales data found.");
                return [];
            }

            const orders = snapshot.val();

            // Convert orders object to array and map fields
            return Object.keys(orders).map((key) => ({
                id: key,
                ...orders[key],
                totalAmount: parseFloat(orders[key].total) || 0, // Ensure totalAmount is a number
                date: orders[key].date, // Assuming the sales data has a 'date' field
            }));
        } catch (error) {
            console.error("Error fetching sales data:", error);
            return [];
        }
    }, []);

    // Effect to fetch and calculate total sales based on selected time range
    useEffect(() => {
    const fetchTotalSales = async () => {
        const salesData = await fetchSalesData(); // Fetch all sales data
        const { startDate, endDate } = calculateDateRange(); // Calculate the date range based on selected range

        // If the time range is "Today", ensure we strip the time from both startDate and endDate
        if (timeRange === "Today") {
            startDate.setHours(0, 0, 0, 0); // Set to midnight of today
            endDate.setHours(23, 59, 59, 999); // Set to the last moment of today
        }

        // Filter sales data for the selected date range
        const totalForRange = salesData.reduce((acc, sale) => {
            const saleDate = new Date(sale.date);
            
            // Ensure the saleDate has no time component for accurate comparison (for today)
            saleDate.setHours(0, 0, 0, 0); // Set sale's date to midnight (remove time portion)

            if (saleDate >= startDate && saleDate <= endDate) {
                acc += sale.totalAmount; // Add up the sales total for this transaction
            }
            return acc;
        }, 0);

        setTotalSales(totalForRange);
    };

    fetchTotalSales();
}, [timeRange, calculateDateRange, fetchSalesData]); // Re-run when timeRange changes


    return (
        <div className={Chartcss.containerChart2}>
            <div className={Chartcss.containerText}>
                <FaReact size={25} />
                <p className="m-0 p-0">Total Sales</p>
            </div>
            <div className={Chartcss.contentChart}>
                <p className="m-0">
                    {totalSales.toLocaleString("en-PH", { style: "currency", currency: "PHP" })}
                </p>
                <div className={Chartcss.dropdown}>
                    <select
                        className="form-select"
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)} // Handle change to set the selected value
                    >
                        <option value="Today">Today</option>
                        <option value="7 Days">7 Days</option>
                        <option value="Month">Month</option>
                        <option value="Year">Year</option>
                    </select>
                </div>
            </div>
        </div>
    );
}

export default Chart2;
