import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { fetchTransactionHistory } from '../../../services/ProductService';

function ChartLg3() {
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        const fetchAndProcessSalesData = async () => {
            try {
                const sales = await fetchTransactionHistory();

                // Group sales by date
                const salesByDate = sales.reduce((acc, sale) => {
                    const saleDate = new Date(sale.date).toLocaleDateString(); // Format date to be consistent
                    if (!acc[saleDate]) {
                        acc[saleDate] = 0;
                    }
                    acc[saleDate] += sale.total; // Assuming 'total' is the total amount in the transaction
                    return acc;
                }, {});

                // Prepare chart data
                const labels = Object.keys(salesByDate).sort(); // Sorted dates
                const data = labels.map((date) => salesByDate[date]); // Corresponding sales

                setChartData({
                    labels,
                    datasets: [
                        {
                            label: 'Daily Sales (₱)',
                            data,
                            borderColor: 'rgba(75, 192, 192, 1)',
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderWidth: 2,
                            fill: true,
                        },
                    ],
                });
            } catch (error) {
                console.error('Error processing sales data:', error);
            }
        };

        fetchAndProcessSalesData();
    }, []);

    if (!chartData) {
        return <p>Loading sales trends...</p>;
    }

    return (
        <div className="containerChartLg3">
            <h3>Sales Trends</h3>
            <Line data={chartData} />
        </div>
    );
}

export default ChartLg3;
