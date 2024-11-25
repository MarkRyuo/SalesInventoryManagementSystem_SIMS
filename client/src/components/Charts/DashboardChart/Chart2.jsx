import { useState, useEffect } from 'react';
import Chartcss from './Charts.module.scss';
import { fetchTotalSales } from '../../../services/Fetching/TransactionServices'; // Ensure correct import path

//* Chart2 Small
function Chart2() {
    const [totalSales, setTotalSales] = useState(0);  // State to store raw total sales
    const [selectedRange, setSelectedRange] = useState('today');  // Default range set to 'today'

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch total sales based on the selected range
                const sales = await fetchTotalSales(selectedRange);
                // Extract the numeric part from the formatted sales string (e.g., '₱1,500.00' -> 1500.00)
                const numericSales = parseFloat(sales.replace(/[^\d.-]/g, '')); // Remove non-numeric characters and convert to float
                setTotalSales(numericSales);  // Set the raw numeric value into state
            } catch (error) {
                console.error("Error fetching total sales:", error);
            }
        };

        fetchData(); // Call the function when the component mounts or when the selected range changes
    }, [selectedRange]);  // Add selectedRange as a dependency so it refetches on change

    // Handle the range selection
    const handleRangeChange = (range) => {
        setSelectedRange(range); // Update the selected range
    };

    return (
        <div className={Chartcss.containerChart2}>
            <h5>Total Sales</h5>
            <div className={Chartcss.contentChart2}>
                <p>{totalSales.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}</p> {/* Display total sales formatted */}
                {/* <p>From the {selectedRange}</p> */}
            </div>
            <div className={Chartcss.rangeSelector}>
                <select onChange={(e) => handleRangeChange(e.target.value)} defaultValue="today" className='form-select'>
                    <option value="today">Today</option>
                    <option value="week">Week</option>
                    <option value="month">Month</option>
                    <option value="year">Year</option>
                </select>
            </div>

        </div>
    );
}

export default Chart2;
