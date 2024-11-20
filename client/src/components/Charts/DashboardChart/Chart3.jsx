import Chartcss from './Charts.module.scss';
import { FaReact } from "react-icons/fa";
import { useState, useEffect } from "react";
import { fetchQuantitySoldByRange } from '../../../services/ProductService'; // Import the new service

function Chart3() {
    const [quantitySold, setQuantitySold] = useState(0);
    const [timeRange, setTimeRange] = useState("Today");

    useEffect(() => {
        const fetchQuantitySold = async () => {
            try {
                const totalQuantity = await fetchQuantitySoldByRange(timeRange);
                setQuantitySold(totalQuantity);
            } catch (error) {
                console.error('Error fetching quantity sold:', error);
                setQuantitySold(0); // Fallback to 0 in case of error
            }
        };

        fetchQuantitySold();
    }, [timeRange]); // Re-fetch sales data whenever timeRange changes

    return (
        <div className={Chartcss.containerChart3}>
            <div className={Chartcss.containerText}>
                <FaReact size={25} />
                <p className='m-0 p-0'>Quantity Sold</p>
            </div>

            <div className={Chartcss.contentChart}>
                <p className='m-0'>{quantitySold}</p>
                <div className={Chartcss.dropdown}>
                    <select
                        className="form-select"
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)} // Handle change to set the selected value
                    >
                        <option value="Today">Today</option>
                        <option value="7 Days">7 Days</option>
                        <option value="Month">Month</option>
                        <option value="Year">Year</option>
                    </select>
                </div>
            </div>

        </div>
    );
}

export default Chart3;
