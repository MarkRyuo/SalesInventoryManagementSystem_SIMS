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

            <div className='main-component'>
                {/* Dashboard Components */}
                <div>
                    <Image src="holder.js/171x180" roundedCircle />
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