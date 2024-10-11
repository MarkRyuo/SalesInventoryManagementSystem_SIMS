import {Row, Col} from 'react-bootstrap' ;
import { MainLayout } from '../layout/MainLayout';
import { RxDashboard } from "react-icons/rx";
import Chart1 from '../components/Charts/DashboardChart/Chart1';

export const DashboardPage = () => {


    return (
        
        <MainLayout>

                {/* Dashboard Components */}
                <p className='fs-3 text-center d-inline'>
                <span style={{marginRight: "8px"}}><RxDashboard /></span>
                Dashboard
                </p>
                
                <Row className='rowContainer'>
                    <Col className='colContainer'>
                        <Chart1 />
                    </Col>
                </Row>

        </MainLayout>


    )
}

export default DashboardPage ;