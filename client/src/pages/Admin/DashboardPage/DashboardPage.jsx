/* eslint-disable react-hooks/exhaustive-deps */
import { Image } from 'react-bootstrap';
import { MainLayout } from '../../../layout/MainLayout';
import DashboardCss from './Dashboard.module.scss';
import { useEffect, useState } from 'react';
import { db } from '../../../services/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';


//? Charts
import Chart1 from '../../../components/Charts/DashboardChart/Chart1';
import Chart2 from '../../../components/Charts/DashboardChart/Chart2';
import Chart3 from '../../../components/Charts/DashboardChart/Chart3';
import ChartLg1 from '../../../components/Charts/DashboardChart/ChartLg1';
import ChartLg2 from '../../../components/Charts/DashboardChart/ChartLg2';
import ChartLg3 from '../../../components/Charts/DashboardChart/ChartLg3';
import Chart4 from '../../../components/Charts/DashboardChart/Chart4';


export const DashboardPage = () => {
    const [adminName, setAdminName] = useState('');
    const [adminGender, setAdminGender] = useState('');
    const [currentDate, setCurrentDate] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

    const resetSessionTimer = () => {
        localStorage.setItem('lastActivity', Date.now());
    };

    const checkSessionTimeout = () => {
        const lastActivity = localStorage.getItem('lastActivity');
        if (lastActivity && Date.now() - lastActivity > SESSION_TIMEOUT) {
            localStorage.removeItem('adminId');
            navigate('/');
        }
    };

    useEffect(() => {
        resetSessionTimer(); // Initialize lastActivity
        const activityEvents = ['click', 'keydown', 'mousemove', 'scroll'];

        // Update lastActivity on user interaction
        const updateActivity = () => resetSessionTimer();
        activityEvents.forEach((event) =>
            window.addEventListener(event, updateActivity)
        );

        // Check session timeout periodically
        const sessionInterval = setInterval(checkSessionTimeout, 1000);

        return () => {
            activityEvents.forEach((event) =>
                window.removeEventListener(event, updateActivity)
            );
            clearInterval(sessionInterval);
        };
    }, [navigate]);


    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const adminId = localStorage.getItem('adminId');
                if (!adminId) {
                    console.error('Admin ID not found');
                    navigate('/'); // Redirect to login if adminId is missing
                    return;
                }

                const adminDocRef = doc(db, 'admins', adminId);
                const adminDoc = await getDoc(adminDocRef);

                // Add this part to handle missing admin document
                if (!adminDoc.exists()) {
                    console.error('Admin document not found.');
                    navigate('/'); // Redirect to login if document doesn't exist
                    return;
                }

                const { firstname, lastname, gender } = adminDoc.data();
                setAdminName(`${firstname} ${lastname}`);
                setAdminGender(gender || '');
            } catch (error) {
                console.error('Error fetching admin data:', error);
                navigate('/'); // Redirect on error
            } finally {
                setIsLoading(false);
            }
        };

        fetchAdminData();
        // Set the real-time date
        const updateDate = () => {
            const now = new Date();
            const formattedDate = now.toLocaleDateString('en-PH', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
            setCurrentDate(formattedDate);
        };

        updateDate();
        const dateInterval = setInterval(updateDate, 1000); // Update date every second

        return () => clearInterval(dateInterval); // Clean up the interval on component unmount
    }, [navigate]);

    const getSalutation = (gender) => {
        if (gender.toLowerCase() === 'male') return 'Mr.';
        if (gender.toLowerCase() === 'female') return 'Ms.';
        return ''; // Return an empty string if gender is not specified
    };

    return (
        <MainLayout>
            <div className={DashboardCss.mainTopComponent}>
                <div className={DashboardCss.componentHeroCard}>
                    <h1 className='d-flex'>Dashboard</h1>
                    {isLoading ? (
                        <div className={DashboardCss.loadingContainer}>
                            <p>Loading admin Dashboard</p>
                        </div>
                    ) : (
                        <div className={DashboardCss.credentialDashboard}>
                            <Image
                                src="/Reyes_Electronics_LogoBg.png"
                                roundedCircle
                            />
                            <div>
                                <h4 className='m-0'>
                                    <span className='fw-semibold'>Hello,</span> <span>{getSalutation(adminGender)}</span> {adminName || 'Admin'}
                                </h4>
                                <p className='m-0'>REYES ELECTRONICS.</p>
                                <p className='m-0'>{currentDate}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {!isLoading && (

                    <div className={DashboardCss.smallContainer}>
                        <div>
                            <Chart1 />
                            <Chart2 />
                            <Chart3 />
                            <Chart4 />
                        </div>
                        <div className={DashboardCss.largeContainer}>
                            <div className={DashboardCss.divLG}>
                                <ChartLg3 />
                                <ChartLg2 />
                            </div>
                                <ChartLg1 />
                        </div>
                    </div>

            )}
        </MainLayout>
    );
};
export default DashboardPage;
