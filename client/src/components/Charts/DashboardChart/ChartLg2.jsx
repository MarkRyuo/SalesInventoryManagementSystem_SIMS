import { useEffect, useState, useCallback } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import Chartcss from './Charts.module.scss';
import { Form } from 'react-bootstrap';
import { fetchSalesData } from '../../../services/ProductService';

// Registering Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function ChartLg2() {
    const [turnoverData, setTurnoverData] = useState([]);
    const [loading, setLoading] = useState(true);

    // Initialize start and end date states
    const [startDate, setStartDate] = useState('2024-01-01');  // Default to January 1, 2024
    const [endDate, setEndDate] = useState('2024-12-31');    // Default to December 31, 2024

    // Filter sales data by date
    const filterSalesDataByDate = useCallback((data, startDate, endDate) => {
        return data.filter((item) => {
            const orderDate = new Date(item.date); // Assuming `item.date` is the date of the sale
            return orderDate >= new Date(startDate) && orderDate <= new Date(endDate);
        });
    }, []);

    // Group sales data by month
    const groupSalesByMonth = useCallback((salesData) => {
        const months = salesData.reduce((acc, item) => {
            const date = new Date(item.date);
            const monthYear = date.toLocaleString('default', { month: 'long', year: 'numeric' }); // 'January 2024'

            if (!acc[monthYear]) acc[monthYear] = [];
            acc[monthYear].push(item);

            return acc;
        }, {});

        return Object.keys(months).map((month) => {
            return {
                month, // Correct month format (e.g. 'January 2024')
                data: months[month]
            };
        });
    }, []);


    // Calculate Inventory Turnover
    const calculateTurnover = useCallback((salesData) => {
        const groupedData = groupSalesByMonth(salesData);
        console.log(groupedData); // Debug log to check the grouping logic

        const currentInventory = 30000; // Replace with actual inventory data

        return groupedData.map((monthData) => {
            const totalCOGS = monthData.data.reduce((acc, item) => acc + item.totalAmount, 0); // Total sales value for the month
            const turnover = totalCOGS / currentInventory;  // Inventory Turnover Formula
            return {
                month: monthData.month, // Correct month from grouping
                turnover,
            };
        });
    }, [groupSalesByMonth]);



    // Fetch sales data and calculate inventory turnover
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const salesData = await fetchSalesData();
                const filteredData = filterSalesDataByDate(salesData, startDate, endDate);
                const turnoverValues = calculateTurnover(filteredData);
                setTurnoverData(turnoverValues);
                setLoading(false);
                console.log(turnoverValues); // Debug log to check the turnover data
            } catch (error) {
                console.error('Error fetching sales data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, [startDate, endDate, filterSalesDataByDate, calculateTurnover]);

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
