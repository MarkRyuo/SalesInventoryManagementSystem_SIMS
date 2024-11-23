import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import Chartcss from './Charts.module.scss';
import { getDatabase, ref, get } from 'firebase/database';
import { Form, Spinner } from 'react-bootstrap';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Fetch all transaction history from Firebase
const fetchTransactionHistory = async () => {
    const db = getDatabase();
    const transactionHistoryRef = ref(db, 'TransactionHistory/');

    try {
        const snapshot = await get(transactionHistoryRef);

        if (!snapshot.exists()) {
            console.log("No transaction history found");
            return [];
        }

        return Object.values(snapshot.val());
    } catch (error) {
        console.error("Error fetching transaction history:", error);
        return [];
    }
};

// Fetch product cost for an individual product
const fetchProductCost = async (productId) => {
    const db = getDatabase();
    const productRef = ref(db, `products/${productId}`);

    try {
        const snapshot = await get(productRef);
        if (!snapshot.exists()) return 0;

        const productData = snapshot.val();
        return productData.cost || 0; // Assuming `cost` is stored in the product data
    } catch (error) {
        console.error('Error fetching product cost:', error);
        return 0;
    }
};

// Fetch sales data (COGS) for a specific date range
const fetchSalesDataAndCOGS = async (startDate, endDate) => {
    try {
        const transactions = await fetchTransactionHistory();

        // Filter transactions by date range
        const filteredTransactions = transactions.filter(({ date }) => date >= startDate && date <= endDate);

        // Calculate total COGS from item-level costs in the transaction
        const totalCOGS = await filteredTransactions.reduce(async (sumPromise, { items }) => {
            let sum = await sumPromise;
            const itemsCOGS = await items.reduce(async (itemSumPromise, { productId, quantity }) => {
                const productCost = await fetchProductCost(productId);
                const itemSum = await itemSumPromise;
                return itemSum + (productCost * quantity); // Calculate cost for each item
            }, 0);
            return sum + itemsCOGS;
        }, Promise.resolve(0));

        return totalCOGS;
    } catch (error) {
        console.error('Error fetching sales data:', error);
        return 0;
    }
};

// Fetch beginning and ending inventory for a product
const fetchProductInventory = async (productId) => {
    const db = getDatabase();
    const productRef = ref(db, `products/${productId}`);

    try {
        const snapshot = await get(productRef);
        if (!snapshot.exists()) return { beginningInventory: 0, endingInventory: 0 };

        const productData = snapshot.val();
        const beginningInventory = productData.quantity || 0;
        const endingInventory = beginningInventory; // Adjust for stock movements if needed

        return { beginningInventory, endingInventory };
    } catch (error) {
        console.error('Error fetching product inventory:', error);
        return { beginningInventory: 0, endingInventory: 0 };
    }
};

// Calculate Inventory Turnover
const calculateInventoryTurnover = async (productId, startDate, endDate) => {
    try {
        const cogs = await fetchSalesDataAndCOGS(startDate, endDate);
        const { beginningInventory, endingInventory } = await fetchProductInventory(productId);

        const averageInventory = (beginningInventory + endingInventory) / 2;
        if (averageInventory === 0) return 0;

        return Math.round((cogs / averageInventory) * 100) / 100;
    } catch (error) {
        console.error('Error calculating inventory turnover:', error);
        return 0;
    }
};

// Function to get the list of all days between two dates
const getDaysInRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = [];
    let currentDate = start;

    while (currentDate <= end) {
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        days.push(`${year}-${month}-${day}`);  // Format as YYYY-MM-DD
        currentDate.setDate(currentDate.getDate() + 1);  // Increment by one day
    }

    return days;
};

// Chart Component
function ChartLg2() {
    const [turnoverData, setTurnoverData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [startDate, setStartDate] = useState('2024-01-01');
    const [endDate, setEndDate] = useState('2024-12-31');

    const productId = 'some-product-id'; // Replace with actual product ID

    useEffect(() => {
        const fetchTurnoverData = async () => {
            setLoading(true);

            try {
                const days = getDaysInRange(startDate, endDate); // Use days instead of months
                const results = await Promise.all(
                    days.map(async (day) => {
                        const turnover = await calculateInventoryTurnover(productId, day, day); // Same day start and end
                        return { day, turnover };
                    })
                );

                setTurnoverData(results);
            } catch (error) {
                console.error('Error fetching turnover data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTurnoverData();
    }, [productId, startDate, endDate]);

    const chartData = {
        labels: turnoverData.map(({ day }) => day), // Use day for the labels
        datasets: [
            {
                label: 'Inventory Turnover',
                data: turnoverData.map(({ turnover }) => turnover),
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
                <div className="text-center">
                    <Spinner animation="border" />
                    <p>Loading Inventory Turnover...</p>
                </div>
            ) : turnoverData.length === 0 ? (
                <p>No data available to display turnover.</p>
            ) : (
                <Line data={chartData} />
            )}
        </div>
    );
}

export default ChartLg2;
