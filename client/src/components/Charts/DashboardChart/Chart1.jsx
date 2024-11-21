import { useEffect, useState } from 'react';
import Chartcss from './Charts.module.scss';
import { FaReact } from "react-icons/fa";
import { fetchAddedQuantityHistory } from '../../../services/ProductService'; // Adjust path

function Chart1() {
    const [stockInTotal, setStockInTotal] = useState(0);
    const [filter, setFilter] = useState("today"); // Default filter is 'today'

    // Helper functions for filtering
    const isSameDay = (date1, date2) => {
        return date1.toDateString() === date2.toDateString();
    };

    const isWithinLastNDays = (date, now, n) => {
        const diff = now - date;
        return diff >= 0 && diff <= n * 24 * 60 * 60 * 1000;
    };

    // Fetch data from Firebase on component mount
    useEffect(() => {
        fetchAddedQuantityHistory((data) => {
            if (data && data.length > 0) {
                console.log("Fetched data:", data); // Debugging: Log data fetched from Firebase

                // Get current date and time for comparison
                const now = new Date();

                // Filter data based on the selected filter
                const filteredTotal = data.reduce((total, entry) => {
                    const entryDate = new Date(entry.date); // Assuming `date` exists in each entry

                    if (filter === "today" && isSameDay(entryDate, now)) {
                        return total + entry.quantity;
                    } else if (filter === "7days" && isWithinLastNDays(entryDate, now, 7)) {
                        return total + entry.quantity;
                    } else if (filter === "month" && entryDate.getMonth() === now.getMonth() &&
                        entryDate.getFullYear() === now.getFullYear()) {
                        return total + entry.quantity;
                    } else if (filter === "year" && entryDate.getFullYear() === now.getFullYear()) {
                        return total + entry.quantity;
                    }

                    return total;
                }, 0);

                console.log("Filtered Total:", filteredTotal); // Debugging: Log the filtered total
                setStockInTotal(filteredTotal);
            } else {
                setStockInTotal(0); // No data available
            }
        });
    }, [filter]); // Re-run effect when filter changes

    return (
        <div className={Chartcss.containerChart1}>
            <div className={Chartcss.containerText}>
                <FaReact size={25} />
                <p className='m-0 p-0'>Stock In Overview</p>
            </div>
            <div className={Chartcss.contentChart}>
                <div className={Chartcss.contentChart}>
                    <p className='m-0'>{stockInTotal}</p>
                    <p className='m-2'>
                        {filter === "today" && "From today"}
                        {filter === "7days" && "From the last 7 days"}
                        {filter === "month" && "From this month"}
                        {filter === "year" && "From this year"}
                    </p>
                    <div className="d-flex justify-content-center mb-2">
                        <select
                            className="form-select w-auto"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        >
                            <option value="today">Today</option>
                            <option value="7days">Last 7 Days</option>
                            <option value="month">This Month</option>
                            <option value="year">This Year</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Chart1;
