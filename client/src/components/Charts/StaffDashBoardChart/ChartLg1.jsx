import { useEffect, useState } from "react";
import StaffChartcss from './StaffCharts.module.scss';
import { getDatabase, ref, onValue } from "firebase/database";
import { LiaProductHunt } from 'react-icons/lia';

function ChartLg1() {
    const [activityToday, setActivityToday] = useState([]);

    useEffect(() => {
        const db = getDatabase();
        const productsRef = ref(db, 'products');

        // Helper function to format today's date
        const getFormattedToday = () => {
            const today = new Date();
            const philippineOffset = 8 * 60; // Philippine Time Zone Offset (UTC +8)
            const localTime = new Date(today.getTime() + (philippineOffset - today.getTimezoneOffset()) * 60000);
            return localTime.toISOString().split('T')[0];
        };

        // Listen for live updates
        const unsubscribe = onValue(productsRef, (snapshot) => {
            const products = snapshot.val();
            if (!products) {
                setActivityToday([]);
                return;
            }

            const formattedToday = getFormattedToday();
            const activities = [];

            Object.keys(products).forEach(key => {
                const product = products[key];

                // Add added activities for today
                product.addedQuantityHistory?.forEach(entry => {
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

                // Add deducted activities for today
                product.deductedQuantityHistory?.forEach(entry => {
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

        // Cleanup listener on component unmount
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        // Reset the activity data at midnight
        const resetAtMidnight = () => {
            const now = new Date();
            const nextMidnight = new Date(now);
            nextMidnight.setHours(24, 0, 0, 0); // Set time to next midnight
            const timeout = nextMidnight.getTime() - now.getTime(); // Calculate time until midnight

            setTimeout(() => {
                setActivityToday([]); // Reset activities at midnight
                resetAtMidnight(); // Set the next reset
            }, timeout);
        };

        resetAtMidnight(); // Initiate the midnight reset

    }, []);

    return (
        <div className={StaffChartcss.containerChartLg1}>
            <p className="m-0 ps-4">Products Activities Today</p>
            {activityToday.length > 0 ? (
                <div className={StaffChartcss.activityList}>
                    {activityToday.map((activity, index) => (
                        <div key={index} className={`${StaffChartcss.activityItem} ${activity.type === 'Added' ? Chartcss.added : Chartcss.removed}`}>
                            <span className={StaffChartcss.icon}></span>
                            <div className={StaffChartcss.activityDetails}>
                                <h1 className="m-0"><LiaProductHunt size={25} />{activity.productName} </h1>
                                <p className="m-0">SKU: {activity.sku} </p>
                                <p className="m-0">Price: {activity.price} </p>
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
