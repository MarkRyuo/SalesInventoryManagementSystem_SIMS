import { useEffect, useState } from 'react';
import Chartcss from './Charts.module.scss';
import { FaReact } from "react-icons/fa";
import { getDatabase, ref, onValue } from "firebase/database";

function Chart1() {
    // State to store the live stock-in data
    const [stockInTotal, setStockInTotal] = useState(0);

    // Fetch data from Firebase on component mount
    useEffect(() => {
        const db = getDatabase();
        const stockInRef = ref(db, 'AddedQuantityHistory'); // Adjust path to match your database structure

        // Listener for real-time updates
        const unsubscribe = onValue(stockInRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();

                // Calculate total stock-in for the running month
                const currentMonth = new Date().getMonth() + 1; // Months are 0-indexed
                const runningMonthTotal = Object.values(data).reduce((total, entry) => {
                    const entryMonth = new Date(entry.date).getMonth() + 1; // Assuming `date` exists in each entry
                    return entryMonth === currentMonth ? total + entry.quantity : total;
                }, 0);

                setStockInTotal(runningMonthTotal);
            } else {
                setStockInTotal(0); // No data available
            }
        });

        return () => unsubscribe(); // Clean up listener on unmount
    }, []);

    return (
        <div className={Chartcss.containerChart1}>
            <div className={Chartcss.containerText}>
                <FaReact size={25} />
                <p className='m-0 p-0'>Stock In Overview</p>
            </div>
            <div className={Chartcss.contentChart}>
                <p className='m-0'>{stockInTotal}</p>
                <p className='m-2'>From the running month</p>
            </div>
        </div>
    );
}

export default Chart1;
