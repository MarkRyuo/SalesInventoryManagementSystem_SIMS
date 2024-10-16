import { Row, Col, Image } from 'react-bootstrap';
import { MainLayout } from '../layout/MainLayout';
import DashboardCss from './Css/Dashboard.module.css';
import { useEffect, useState } from 'react';
import { db } from '../services/firebase';
import { doc, getDoc } from 'firebase/firestore';

//? Charts
import Chart1 from '../components/Charts/DashboardChart/Chart1';
import Chart2 from '../components/Charts/DashboardChart/Chart2';
import Chart3 from '../components/Charts/DashboardChart/Chart3';
import ChartLg1 from '../components/Charts/DashboardChart/ChartLg1';
import ChartLg2 from '../components/Charts/DashboardChart/ChartLg2';

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
                        <>
                            <Image
                                src="https://i.pinimg.com/control/564x/6a/61/32/6a6132119767a37330924720a5733a96.jpg"
                                roundedCircle
                                style={{ width: '100%', maxWidth: '100px', height: '100px' }}
                            />
                            <div>
                                <p className='fs-4 m-0'>
                                    <span className='fw-semibold'>Hello,</span> <span>{getSalutation(adminGender)}</span> {adminName || 'Admin'}
                                </p>
                                <p className='m-0'>REYES ELECTRONICS.</p>
                                <p className='m-0'>{currentDate}</p>
                            </div>
                        </>
                    )}
                </div>

                {!isLoading && (
                    <>
                        <div className={DashboardCss.rowContainer}>
                            <Chart1 />
                            <Chart2 />
                            <Chart3 />
                        </div>

                        <Row className={DashboardCss.rowContainerLg}>
                            <Col className={DashboardCss.colContainerLg} sm={12} lg={6}>
                                <ChartLg1 />
                            </Col>
                            <Col className={DashboardCss.colContainerLg} lg={5} md={9} sm={10} xs={10}>
                                <ChartLg2 />
                            </Col>
                        </Row>
                    </>
                )}
            </div>
        </MainLayout>
    );
};

export default DashboardPage;
