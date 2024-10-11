import { Row, Col } from 'react-bootstrap';
import { MainLayout } from '../layout/MainLayout';
import { RxDashboard } from "react-icons/rx";
import Chart1 from '../components/Charts/DashboardChart/Chart1';
import Chart2 from '../components/Charts/DashboardChart/Chart2';
import Chart3 from '../components/Charts/DashboardChart/Chart3';

import DashboardCss from './Css/Dashboard.module.css'
import ChartLg1 from '../components/Charts/DashboardChart/ChartLg1';
import ChartLg2 from '../components/Charts/DashboardChart/ChartLg2';

export const DashboardPage = () => {


    return (

        <MainLayout>

            {/* Dashboard Components */}
            <p className='fs-3 text-center d-inline'>
                <span style={{ marginRight: "8px" }}><RxDashboard /></span>
                Dashboard
            </p>

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
                <Col className='colContainerLg' sm={12} lg={6}>
                    <ChartLg1 />
                </Col>
                <Col className='colContainerLg' lg={5} md={9} sm={10} xs={10}>
                    <ChartLg2 />
                </Col>  
            </Row>

        </MainLayout>


    )
}

export default DashboardPage;