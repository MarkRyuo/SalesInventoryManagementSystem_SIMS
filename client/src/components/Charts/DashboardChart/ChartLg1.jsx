import { useState, useEffect } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import ActivityFeedCSS from './Charts.module.scss';

function ActivityFeed() {
    const [activities, setActivities] = useState([]);
    const db = getDatabase();

    useEffect(() => {
        const activityRef = ref(db, 'activityLogs');

        const unsubscribe = onValue(activityRef, snapshot => {
            const data = snapshot.val();
            if (data) {
                const fetchedActivities = Object.keys(data).map(key => ({
                    id: key,
                    ...data[key],
                }));
                setActivities(fetchedActivities);
            } else {
                setActivities([]);
            }
        });

        return () => unsubscribe();
    }, [db]);

    return (
        <div className={ActivityFeedCSS.containerChartLg1}>
            {activities.map(activity => (
                <div key={activity.id} className={ActivityFeedCSS.activityItem}>
                    <p><strong>{activity.action}:</strong> {activity.details}</p>
                    <p>{new Date(activity.timestamp).toLocaleString()}</p>
                </div>
            ))}
        </div>
    );
}

export default ActivityFeed;
