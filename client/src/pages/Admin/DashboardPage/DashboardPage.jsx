import { Image} from 'react-bootstrap';
import { MainLayout } from '../../../layout/MainLayout';
import DashboardCss from './Dashboard.module.scss';
import { useEffect, useState } from 'react';
import { db } from '../../../services/firebase';
import { doc, getDoc } from 'firebase/firestore';

//? Charts
import Chart1 from '../../../components/Charts/DashboardChart/Chart1';
import Chart2 from '../../../components/Charts/DashboardChart/Chart2';
import Chart3 from '../../../components/Charts/DashboardChart/Chart3';
import ChartLg1 from '../../../components/Charts/DashboardChart/ChartLg1';
import ChartLg2 from '../../../components/Charts/DashboardChart/ChartLg2';

export const DashboardPage = () => {
    const [adminName, setAdminName] = useState('');
    const [adminGender, setAdminGender] = useState('');
    const [currentDate, setCurrentDate] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const adminId = localStorage.getItem('adminId');
                if (!adminId) {
                    console.error('Admin ID not found in localStorage.');
                    return;
                }

                const adminDocRef = doc(db, 'admins', adminId);
                const adminDoc = await getDoc(adminDocRef);

                if (adminDoc.exists()) {
                    const { firstname, lastname, gender } = adminDoc.data();
                    setAdminName(`${firstname} ${lastname}`);
                    setAdminGender(gender || ''); // Store gender if it exists
                } else {
                    console.error('Admin document not found.');
                }
            } catch (error) {
                console.error('Error fetching admin data:', error);
            } finally {
                setIsLoading(false); // Stop loading when data fetch is complete
            }
        };

        fetchAdminData();

        // Set the real-time date
        const updateDate = () => {
            const now = new Date();
            const formattedDate = now.toLocaleDateString('en-US', {
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
    }, []);

    const getSalutation = (gender) => {
        if (gender.toLowerCase() === 'male') return 'Mr.';
        if (gender.toLowerCase() === 'female') return 'Ms.';
        return ''; // Return an empty string if gender is not specified
    };

    return (
        <MainLayout>
            <div className={DashboardCss.mainComponent}>
                <div className={DashboardCss.componentHeroCard}>
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
                                <p className='m-0'>
                                    <span className='fw-semibold'>Hello,</span> <span>{getSalutation(adminGender)}</span> {adminName || 'Admin'}
                                </p>
                                <p className='m-0'>REYES ELECTRONICS.</p>
                                <p className='m-0'>{currentDate}</p>
                            </div>
                        </div>
                    )}
                </div>

                {!isLoading && (
                    <div className={DashboardCss.chartContainer}>
                        <div className={DashboardCss.smallContainer}>
                            <div>
                                <Chart1 />
                            </div>
                            <div>
                                <Chart2 />
                            </div>
                            <div>
                                <Chart3 />
                            </div>
                        </div>

                        <div className={DashboardCss.largeContainer}>
                            <div className={DashboardCss.colContainerLg}>
                                <ChartLg1 />
                            </div>
                            <div className={DashboardCss.colContainerLg}>
                                <ChartLg2 />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </MainLayout>
    );
};

export default DashboardPage;
