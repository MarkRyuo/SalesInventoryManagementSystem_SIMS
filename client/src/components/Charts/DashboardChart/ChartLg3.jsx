import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import Chartcss from './Charts.module.scss';
import { fetchSalesData } from '../../../services/ProductService';

// Registering Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

function ChartLg3() {
    const [salesData, setSalesData] = useState({});
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('daily'); // Default view

    const groupDataByView = (sales, view) => {
        const groupedData = {};

        sales.forEach(({ date, quantitySold, totalAmount }) => {
            let key;
            switch (view) {
                case 'daily':
                    key = date;
                    break;
                case 'monthly':
                    key = date.slice(0, 7); // Extract YYYY-MM from date
                    break;
                case 'quarterly': {
                    const [year, month] = date.split('-');
                    const quarter = Math.ceil(parseInt(month, 10) / 3);
                    key = `${year}-Q${quarter}`;
                    break;
                }
                case 'yearly':
                    key = date.slice(0, 4); // Extract YYYY from date
                    break;
                default:
                    key = date;
            }

            if (!groupedData[key]) {
                groupedData[key] = { quantity: 0, salesAmount: 0 };
            }
            groupedData[key].quantity += quantitySold;  // Sum the quantitySold
            groupedData[key].salesAmount += totalAmount;
        });

        return groupedData;
    };


    useEffect(() => {
        const fetchAndGroupSales = async () => {
            setLoading(true);
            try {
                const sales = await fetchSalesData();
                const groupedSales = groupDataByView(sales, view);
                setSalesData(groupedSales);
            } catch (error) {
                console.error('Error fetching sales data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAndGroupSales();
    }, [view]);

    const sortedKeys = Object.keys(salesData).sort();
    const sortedValues = sortedKeys.map((key) => salesData[key]);

    const chartData = {
        labels: sortedKeys,
        datasets: [
            {
                label: 'Quantity Sold',
                data: sortedValues.map((data) => data.quantity),
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
            },
            {
                label: 'Sales Amount',
                data: sortedValues.map((data) => data.salesAmount),
                borderColor: 'rgba(153, 102, 255, 1)',
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                fill: true,
            },
        ],
    };

    return (
        <div className={Chartcss.containerChartLg3}>
            <div className={Chartcss.filterControls}>
                <label htmlFor="view-select">View by:</label>
                <select
                    id="view-select"
                    value={view}
                    onChange={(e) => setView(e.target.value)}
                    className={Chartcss.selectView}
                >
                    <option value="daily">Daily</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="yearly">Yearly</option>
                </select>
            </div>

            {loading ? (
                <p>Loading chart data...</p>
            ) : sortedKeys.length === 0 ? (
                <p>No sales data available.</p>
            ) : (
                <Line data={chartData} />
            )}
        </div>
    );
}

export default ChartLg3;
