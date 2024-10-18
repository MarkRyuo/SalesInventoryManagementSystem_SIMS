import { Row, Col, Image } from 'react-bootstrap';
import { MainLayout } from '../layout/MainLayout';
import Chart1 from '../components/Charts/DashboardChart/Chart1';
import Chart2 from '../components/Charts/DashboardChart/Chart2';
import Chart3 from '../components/Charts/DashboardChart/Chart3';

import DashboardCss from './Css/Dashboard.module.css'
import ChartLg1 from '../components/Charts/DashboardChart/ChartLg1';
import ChartLg2 from '../components/Charts/DashboardChart/ChartLg2';

export const DashboardPage = () => {


    return (

        <MainLayout>

            <div className={DashboardCss.mainComponent}>
                {/* Dashboard Components */}
                <div className={DashboardCss.componentHeroCard}>
                    <Image src="https://i.pinimg.com/control/564x/6a/61/32/6a6132119767a37330924720a5733a96.jpg" roundedCircle style={{width: 100}} />
                    <div>
                        <p className='fs-4'>Hello, <span>Admin Name{/* Fetch admin firstname & lastname */}</span></p>
                        <p>Date: <span>{/* Realtime Date */}</span></p>
                    </div>
                </div>

                <Row className={DashboardCss.rowContainer} > {/* Fix width(sm-screen) 400px */}
                    <Col className='colContainer' sm={12} md={12} lg={3}>
                        <Chart1 />
                    </Col>
                    <Col className='colContainer' sm={12} md={12} lg={5}>
                        <Chart2 />
                    </Col>
                    <Col className='colContainer' sm={12} md={12} lg={3}>
                        <Chart3 />
                    </Col>
                </Row>

                <Row className={DashboardCss.rowContainerLg}>
                    <Col className={DashboardCss.colContainerLg} sm={12} lg={6}>
                        <ChartLg1 />
                    </Col>
                    <Col className={DashboardCss.colContainerLg} lg={5} md={9} sm={10} xs={10}>
                        <ChartLg2 />
                    </Col>
                </Row>  
            </div>

        </MainLayout>


    )
}

export default DashboardPage;