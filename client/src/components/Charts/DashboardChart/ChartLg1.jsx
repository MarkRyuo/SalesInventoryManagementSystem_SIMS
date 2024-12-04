import { useEffect, useState, useCallback } from "react";
import Chartcss from './Charts.module.scss';
import { getDatabase, ref, onValue } from "firebase/database";
import { LiaProductHunt } from 'react-icons/lia';

function ChartLg1() {
    const [activityToday, setActivityToday] = useState([]);

    // Helper function to format today's date
    const getFormattedToday = useCallback(() => {
        const formatter = new Intl.DateTimeFormat('en-US', {
            timeZone: 'Asia/Manila',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });
        const formatted = formatter.format(new Date()); // Format to Philippine Time
        const [month, day, year] = formatted.split('/');
        return `${year}-${month}-${day}`; // Return YYYY-MM-DD
    }, []);

    useEffect(() => {
        const db = getDatabase();
        const productsRef = ref(db, 'products');

        // Real-time listener
        const unsubscribe = onValue(productsRef, (snapshot) => {
            const products = snapshot.val();
            if (!products) {
                setActivityToday([]);
                return;
            }

            const formattedToday = getFormattedToday();
            const activities = [];

            Object.keys(products).forEach((key) => {
                const product = products[key];

                // Process addedQuantityHistory
                Object.values(product.addedQuantityHistory || {}).forEach((entry) => {
                    if (entry.date === formattedToday) {
                        activities.push({
                            productName: product.productName,
                            sku: product.sku,
                            price: product.price,
                            type: 'Added',
                            quantity: entry.quantity,
                        });
                    }
                });

                // Process deductedQuantityHistory
                Object.values(product.deductedQuantityHistory || {}).forEach((entry) => {
                    if (entry.date === formattedToday) {
                        activities.push({
                            productName: product.productName,
                            sku: product.sku,
                            price: product.price,
                            type: 'Deducted',
                            quantity: entry.quantity,
                        });
                    }
                });
            });

            setActivityToday(activities);
        });

        return () => unsubscribe(); // Cleanup listener
    }, [getFormattedToday]);

    // Midnight Reset
    useEffect(() => {
        const interval = setInterval(() => {
            const formatter = new Intl.DateTimeFormat('en-US', {
                timeZone: 'Asia/Manila',
                hour: 'numeric',
                minute: 'numeric',
                hour12: false,
            });
            const currentTime = formatter.format(new Date());
            if (currentTime === "00:00") {
                setActivityToday([]); // Reset at midnight Philippine Time
            }
        }, 60000); // Check every minute

        return () => clearInterval(interval); // Cleanup interval
    }, []);


    return (
        <div className={Chartcss.containerChartLg1}>
            <p className="m-0">Products Log</p>
            {activityToday.length > 0 ? (
                <div className={Chartcss.activityList}>
                    {activityToday.map((activity, index) => (
                        <div
                            key={index}
                            className={`${Chartcss.activityItem} ${activity.type === 'Added' ? Chartcss.added : Chartcss.removed}`}
                        >
                            <span className={Chartcss.icon}></span>
                            <div className={Chartcss.activityDetails}>
                                <h1 className="m-0">
                                    <LiaProductHunt size={25} />
                                    {activity.productName}
                                </h1>
                                <p className="m-0">SKU: {activity.sku}</p>
                                <p className="m-0">Price: {activity.price}</p>
                                <p className={`m-0 ${activity.type === 'Added' ? 'text-success' : 'text-danger'}`}>
                                    {activity.type} Today: {activity.quantity}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="m-0 p-0">No activities recorded today.</p>
            )}
        </div>
    );
}

export default ChartLg1;
