import { Row, Col } from 'react-bootstrap';
import { MainLayout } from '../layout/MainLayout';
import { RxDashboard } from "react-icons/rx";
import Chart1 from '../components/Charts/DashboardChart/Chart1';
import Chart2 from '../components/Charts/DashboardChart/Chart2';
import Chart3 from '../components/Charts/DashboardChart/Chart3';

import DashboardCss from './Css/Dashboard.module.css'

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

            <Row>
                <Col>
                    
                </Col>
            </Row>

        </MainLayout>


    )
}

export default DashboardPage;