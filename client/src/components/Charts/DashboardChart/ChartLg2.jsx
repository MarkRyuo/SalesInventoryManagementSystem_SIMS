import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import Chartcss from './Charts.module.scss';
import { getDatabase, ref, get } from 'firebase/database';  // Firebase imports
import { Form } from 'react-bootstrap';

// Registering Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Fetch the sales data (COGS) between a specified date range
const fetchSalesDataAndCOGS = async (startDate, endDate) => {
    const db = getDatabase();
    const ordersRef = ref(db, 'TransactionHistory');

    try {
        const snapshot = await get(ordersRef);
        if (!snapshot.exists()) {
            console.log('No sales data found.');
            return 0; // If no sales data, return 0
        }

        const orders = snapshot.val();
        let totalCOGS = 0;

        // Calculate COGS by summing the totalAmount (sales price) within the date range
        Object.keys(orders).forEach((key) => {
            const order = orders[key];
            const { date, totalAmount } = order;

            // Check if the order's date is within the selected range
            if (date >= startDate && date <= endDate) {
                totalCOGS += totalAmount; // Add up the total sales amount to calculate COGS
            }
        });

        console.log('COGS for the period:', totalCOGS);
        return totalCOGS;

    } catch (error) {
        console.error('Error fetching sales data:', error);
        throw new Error(`Error fetching sales data: ${error.message}`);
    }
};

// Fetch the beginning and ending inventory for a specific product
const fetchProductInventory = async (productId) => {
    const db = getDatabase();
    const productRef = ref(db, 'products/' + productId);

    try {
        const snapshot = await get(productRef);
        if (!snapshot.exists()) {
            console.log('Product not found.');
            return { beginningInventory: 0, endingInventory: 0 };
        }

        const productData = snapshot.val();
        const beginningInventory = productData.quantity || 0;  // Assume productData.quantity holds current inventory
        const endingInventory = beginningInventory;  // You can adjust this logic to get the ending inventory based on stock movement

        return { beginningInventory, endingInventory };
    } catch (error) {
        console.error('Error fetching product inventory:', error);
        throw new Error(`Error fetching product inventory: ${error.message}`);
    }
};

// Calculate Inventory Turnover using the COGS and average inventory
const calculateInventoryTurnover = async (productId, startDate, endDate) => {
    try {
        // Fetch COGS (Cost of Goods Sold)
        const cogs = await fetchSalesDataAndCOGS(startDate, endDate);
        if (!cogs) {
            console.log('COGS data is missing.');
            return 0;
        }

        // Fetch Inventory Data
        const inventoryData = await fetchProductInventory(productId);
        if (!inventoryData) {
            throw new Error('Product not found');
        }

        const { beginningInventory, endingInventory } = inventoryData;

        if (beginningInventory === 0 || endingInventory === 0) {
            console.log('Insufficient inventory data to calculate Inventory Turnover.');
            return 0;
        }

        // Calculate Average Inventory
        const averageInventory = (beginningInventory + endingInventory) / 2;
        if (averageInventory === 0) {
            console.log('Average Inventory is zero. Cannot calculate turnover.');
            return 0;
        }

        // Calculate and return Inventory Turnover
        const turnover = cogs / averageInventory;
        console.log(`Inventory Turnover: ${turnover}`);
        return Math.round(turnover * 100) / 100; // Rounded to 2 decimals

    } catch (error) {
        console.error('Error calculating Inventory Turnover:', error);
        return 0; // Return 0 on failure
    }
};

function ChartLg2() {
    const [turnoverData, setTurnoverData] = useState([]);
    const [loading, setLoading] = useState(true);

    // Initialize start and end date states
    const [startDate, setStartDate] = useState('2024-01-01');  // Default to January 1, 2024
    const [endDate, setEndDate] = useState('2024-12-31');    // Default to December 31, 2024

    // Assuming you want to calculate monthly turnover for a product
    const productId = 'some-product-id';  // Replace with actual product ID

    useEffect(() => {
        const fetchTurnoverData = async () => {
            setLoading(true);
            try {
                // Dynamically calculate the months within the date range (startDate to endDate)
                const months = getMonthsInRange(startDate, endDate);
                const turnoverResults = [];

                // Loop through each month in the range and calculate turnover
                for (let i = 0; i < months.length; i++) {
                    const [year, month] = months[i].split('-');
                    const monthStart = `${year}-${month}-01`;  // Start of the month
                    const monthEnd = `${year}-${month}-31`;    // End of the month

                    // Calculate turnover for the month
                    const turnover = await calculateInventoryTurnover(productId, monthStart, monthEnd);
                    turnoverResults.push({ month: months[i], turnover });
                }

                setTurnoverData(turnoverResults);
            } catch (error) {
                console.error('Error fetching turnover data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTurnoverData();
    }, [productId, startDate, endDate]);

    // Utility function to get months in a date range
    const getMonthsInRange = (startDate, endDate) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const months = [];
        let currentDate = start;

        while (currentDate <= end) {
            const year = currentDate.getFullYear();
            const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Get month in format MM
            months.push(`${year}-${month}`);
            currentDate.setMonth(currentDate.getMonth() + 1);
        }

        return months;
    };

    // Prepare data for the chart
    const chartData = {
        labels: turnoverData.map(item => item.month), // X-axis: months
        datasets: [
            {
                label: 'Inventory Turnover',
                data: turnoverData.map(item => item.turnover), // Y-axis: turnover values
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
            },
        ],
    };

    return (
        <div className={Chartcss.containerChartLg2}>
            <div className={Chartcss.datePickerContainer}>
                <Form.Group controlId="startDate">
                    <Form.Label>Select Start Date:</Form.Label>
                    <Form.Control
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                </Form.Group>

                <Form.Group controlId="endDate">
                    <Form.Label>Select End Date:</Form.Label>
                    <Form.Control
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </Form.Group>
            </div>

            {loading ? (
                <p>Loading Inventory Turnover...</p>
            ) : turnoverData.length === 0 ? (
                <p>No data available to display turnover.</p>
            ) : (
                <Line data={chartData} />
            )}
        </div>
    );
}

export default ChartLg2;
