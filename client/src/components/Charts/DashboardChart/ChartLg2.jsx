import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import Chartcss from './Charts.module.scss';
import { calculateInventoryTurnover } from '../../../services/ProductService'; // Assuming you have this function to calculate turnover
import { Form } from 'react-bootstrap';

// Registering Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

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
                // You can dynamically calculate the months within the date range (startDate to endDate)
                const months = getMonthsInRange(startDate, endDate);
                const turnoverResults = [];

                // Loop through each month in the range and calculate turnover
                for (let i = 0; i < months.length; i++) {
                    const [year, month] = months[i].split('-');
                    const monthStart = `${year}-${month}-01`;  // Start of the month
                    const monthEnd = `${year}-${month}-31`;    // End of the month

                    // Calculate turnover for the month (replace with your actual logic to fetch sales data)
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
            <h3>Inventory Turnover Chart</h3>

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
