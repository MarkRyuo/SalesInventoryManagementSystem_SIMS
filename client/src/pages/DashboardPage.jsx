import { Row, Col } from 'react-bootstrap';
import { MainLayout } from '../layout/MainLayout';
import { RxDashboard } from "react-icons/rx";
import Chart1 from '../components/Charts/DashboardChart/Chart1';
import Chart2 from '../components/Charts/DashboardChart/Chart2';
import Chart3 from '../components/Charts/DashboardChart/Chart3';

export const DashboardPage = () => {


    return (

        <MainLayout>

            {/* Dashboard Components */}
            <p className='fs-3 text-center d-inline'>
                <span style={{ marginRight: "8px" }}><RxDashboard /></span>
                Dashboard
            </p>

            <Row className='rowContainer' style={{ border: "1px solid red", width: "100%", height: "auto" }}>
                <Col className='colContainer'>
                    <Chart1 />
                </Col>
                <Col className='colContainer'>
                    <Chart2 />
                </Col>
                <Col className='colContainer'>
                    <Chart3 />
                </Col>
            </Row>

        </MainLayout>


    )
}

export default DashboardPage;