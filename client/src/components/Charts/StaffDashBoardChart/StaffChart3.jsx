import StaffChartcss from './StaffCharts.module.scss';
import { useState, useEffect } from "react";
import { getDatabase, ref, onValue } from "firebase/database"; // Firebase imports
import { Spinner } from 'react-bootstrap'; // Import the Spinner from React-Bootstrap

function Chart3() {
    const [quantitySold, setQuantitySold] = useState(0);
    const [timeRange, setTimeRange] = useState("Today");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchQuantitySold = () => {
            setLoading(true); // Set loading to true when fetching data

            const db = getDatabase();
            const ordersRef = ref(db, 'TransactionHistory'); // Reference to TransactionHistory node

            onValue(ordersRef, snapshot => {
                if (!snapshot.exists()) {
                    setQuantitySold(0); // Return 0 if no data
                    setLoading(false); // Set loading to false when data is fetched
                    return;
                }

                const orders = snapshot.val();
                const now = new Date();
                let startDate, endDate;

                // Helper function to calculate totalQuantity for different ranges
                const calculateTotalQuantity = (orders, startDate, endDate) => {
                    let totalQuantity = 0;
                    Object.keys(orders).forEach(key => {
                        const order = orders[key];
                        const orderDate = new Date(order.date);

                        if (orderDate >= startDate && orderDate <= endDate) {
                            // Sum up the quantity of items sold in the order
                            const quantitySold = order.items.reduce((sum, item) => sum + item.quantity, 0);
                            totalQuantity += quantitySold;
                        }
                    });
                    return totalQuantity;
                };

                switch (timeRange) {
                    case "Today":
                        startDate = new Date(now.setHours(0, 0, 0, 0)); // Start of today
                        endDate = new Date(); // Current time
                        break;
                    case "7 Days":
                        startDate = new Date(now.setDate(now.getDate() - 6)); // 7 days ago
                        endDate = new Date(); // Current time
                        break;
                    case "Month":
                        startDate = new Date(now.getFullYear(), now.getMonth(), 1); // Start of this month
                        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0); // End of this month
                        break;
                    case "Year":
                        startDate = new Date(now.setMonth(0, 1)); // Start of the year
                        endDate = new Date(now.setMonth(11, 31)); // End of the year
                        break;
                    default:
                        setQuantitySold(0);
                        setLoading(false);
                        return;
                }

                let totalQuantity = calculateTotalQuantity(orders, startDate, endDate);

                setQuantitySold(totalQuantity); // Update state with the fetched quantity sold
                setLoading(false); // Set loading to false when data is fetched
            });
        };

        fetchQuantitySold(); // Fetch quantity sold when the component mounts or when the time range changes
    }, [timeRange]); // Re-fetch sales data whenever timeRange changes

    return (
        <div className={StaffChartcss.containerChart3}>
            <h5>Quantity Sold</h5>
            <div className={StaffChartcss.contentChart3}>
                {loading ? (
                    <Spinner animation="grow" variant="success" className='my-2' />
                ) : (
                    <p>{quantitySold}</p>
                )}
                <div>
                    <select
                        className="form-select"
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)} // Handle change to set the selected value
                    >
                        <option value="Today">Today</option>
                        <option value="7 Days">Week</option>
                        <option value="Month">Month</option>
                        <option value="Year">Year</option>
                    </select>
                </div>
            </div>
        </div>
    );
}

export default Chart3;
