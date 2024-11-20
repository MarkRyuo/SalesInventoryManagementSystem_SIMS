import Chartcss from './Charts.module.scss';
import { FaReact } from "react-icons/fa";
import { useState, useEffect, useCallback } from "react";
import { fetchSalesData } from '../../../services/ProductService'; // Import the fetchSalesData function
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

function Chart2() {
    const [totalSales, setTotalSales] = useState(0);
    const [timeRange, setTimeRange] = useState('today'); // Default range is 'today'

    // Define calculateDateRange with useCallback to ensure stable reference
    const calculateDateRange = useCallback(() => {
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        let startDate;

        switch (timeRange) {
            case 'today':
                startDate = startOfDay;
                break;
            case '3days':
                startDate = new Date(startOfDay.getTime() - 3 * 24 * 60 * 60 * 1000);
                break;
            case '7days':
                startDate = new Date(startOfDay.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case 'month':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1); // Start of the month
                break;
            case 'year':
                startDate = new Date(now.getFullYear(), 0, 1); // Start of the year
                break;
            default:
                startDate = startOfDay;
        }

        return { startDate, endDate: now };
    }, [timeRange]); // Depend only on timeRange

    useEffect(() => {
        const fetchTotalSales = async () => {
            try {
                const salesData = await fetchSalesData(); // Fetch all sales data
                const { startDate, endDate } = calculateDateRange();

                // Filter sales data for the selected range
                const totalForRange = salesData.reduce((acc, sale) => {
                    const saleDate = new Date(sale.date);
                    if (saleDate >= startDate && saleDate <= endDate) {
                        acc += sale.totalAmount; // Add up the sales total for this transaction
                    }
                    return acc;
                }, 0);

                setTotalSales(totalForRange);
            } catch (error) {
                console.error('Error fetching sales data:', error);
            }
        };

        fetchTotalSales();
    }, [timeRange, calculateDateRange]); // Ensure dependencies are correctly listed

    return (
        <div className={Chartcss.containerChart2}>
            <div className={Chartcss.containerText}>
                <FaReact size={25} />
                <p className='m-0 p-0'>Total Sales</p>
            </div>
            <div className={Chartcss.contentChart}>
                <p className='m-0'>{totalSales}</p>
                <p className='m-2'>From the selected range</p>
            </div>
            <DropdownButton
                id="dropdown-time-range"
                title={`Time Range: ${timeRange}`}
                variant="primary"
                className={Chartcss.dropdownButton}
            >
                <Dropdown.Item onClick={() => setTimeRange('today')}>Today</Dropdown.Item>
                <Dropdown.Item onClick={() => setTimeRange('3days')}>Last 3 Days</Dropdown.Item>
                <Dropdown.Item onClick={() => setTimeRange('7days')}>Last 7 Days</Dropdown.Item>
                <Dropdown.Item onClick={() => setTimeRange('month')}>Month-to-Date</Dropdown.Item>
                <Dropdown.Item onClick={() => setTimeRange('year')}>Year-to-Date</Dropdown.Item>
            </DropdownButton>
        </div>
    );
}

export default Chart2;
