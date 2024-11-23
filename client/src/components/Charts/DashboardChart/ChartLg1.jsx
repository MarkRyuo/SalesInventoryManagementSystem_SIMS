import { useEffect, useState } from "react";
import Chartcss from './Charts.module.scss';
import { getDatabase, ref, onValue } from "firebase/database";
import { LiaProductHunt } from 'react-icons/lia';

function ChartLg1() {
    const [activityToday, setActivityToday] = useState([]);

    useEffect(() => {
        const db = getDatabase();
        const productsRef = ref(db, 'products');

        const today = new Date();
        const philippineOffset = 8 * 60; // Philippine Time Zone Offset (UTC +8)
        const localTime = new Date(today.getTime() + (philippineOffset - today.getTimezoneOffset()) * 60000);
        const formattedToday = localTime.toISOString().split('T')[0];

        // Listen for live updates
        const unsubscribe = onValue(productsRef, (snapshot) => {
            const products = snapshot.val();
            if (!products) {
                setActivityToday([]);
                return;
            }

            // Collect all today's activities (added and deducted)
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

    return (
        <div className={Chartcss.containerChartLg1}>
            <p className="fs-6 m-0 ps-4">Products Activities Today</p>
            {activityToday.length > 0 ? (
                <div
                    style={{
                        display: 'flex',
                        gap: '10px',
                        overflowX: 'auto',
                        alignItems: 'flex-start',
                        flexWrap: 'wrap',
                    }}
                >
                    {activityToday.map((activity, index) => (
                        <div
                            key={index}
                            style={{
                                width: 'auto',
                                padding: 20,
                                boxShadow: '1px 1px 5px #e2dfdf',
                                borderRadius: 15,
                                flexShrink: 0,
                                borderLeft: activity.type === 'Added' ? '2px solid #92E3B8' : '2px solid #F28C8C',
                                boxSizing: "border-box",
                            }}
                        >
                            <span><LiaProductHunt size={25} /></span>
                            <p className="fs-5 m-0">{activity.productName}</p>
                            <p className="fs-6 m-0">SKU: {activity.sku}</p>
                            <p className="fs-6 m-0">Price: {activity.price}</p>
                            <p className={`fs-6 m-0 ${activity.type === 'Added' ? 'text-success' : 'text-danger'}`}>
                                {activity.type} Today: {activity.quantity}
                            </p>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No activities recorded today.</p>
            )}
        </div>
    );
}

export default ChartLg1;
