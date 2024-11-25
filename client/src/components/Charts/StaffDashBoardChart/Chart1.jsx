import { useState, useEffect } from 'react';
import StaffChartcss from './StaffCharts.module.scss';
import { getProductQuantityHistory, filterQuantityByRange } from '../../../services/Fetching/StockInServices'; // Import the functions

// Chart1 Small component to display quantity data for the selected time range
function Chart1() {
    const [quantity, setQuantity] = useState(0);
    const [timeRange, setTimeRange] = useState('Today'); // Default to 'Today'

    const handleTimeRangeChange = (range) => {
        setTimeRange(range);
    };

    useEffect(() => {
        const fetchQuantity = async () => {
            try {
                const quantityHistories = await getProductQuantityHistory();
                // Filter the quantity histories by selected time range
                const totalQuantity = filterQuantityByRange(quantityHistories, timeRange);
                setQuantity(totalQuantity);
            } catch (error) {
                console.error('Error fetching quantity:', error);
            }
        };

        fetchQuantity();
    }, [timeRange]); // Re-fetch data if timeRange changes

    return (
        <div className={StaffChartcss.containerChart1}>
            {/* <p>From the running {timeRange.toLowerCase()}</p> */}
            <h5>Stock In</h5>
            <div className={StaffChartcss.contentChart1}>
                <p>{quantity}</p>
            </div>
            <div className={StaffChartcss.rangeSelector}>
                <select onChange={(e) => handleTimeRangeChange(e.target.value)} value={timeRange} className='form-select'>
                    <option value="Today">Today</option>
                    <option value="Week">Week</option>
                    <option value="Month">Month</option>
                    <option value="Year">Year</option>
                </select>
            </div>
        </div>

    );
}

export default Chart1;
