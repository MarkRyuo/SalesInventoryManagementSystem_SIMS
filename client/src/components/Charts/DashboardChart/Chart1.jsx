import { useState, useEffect } from 'react';
import { FaReact } from 'react-icons/fa';
import Chartcss from './Charts.module.scss';
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
        <div className={Chartcss.containerChart1}>
            <div className={Chartcss.containerText}>
                <FaReact size={25} />
                <p>Stock Quantity</p>
            </div>
            <div className={Chartcss.contentChart}>
                <p>{quantity}</p>
                <p>From the running {timeRange.toLowerCase()}</p>
                <div>
                    <button onClick={() => handleTimeRangeChange('Today')}>Today</button>
                    <button onClick={() => handleTimeRangeChange('Week')}>Week</button>
                    <button onClick={() => handleTimeRangeChange('Month')}>Month</button>
                    <button onClick={() => handleTimeRangeChange('Year')}>Year</button>
                </div>
            </div>
        </div>
    );
}

export default Chart1;
