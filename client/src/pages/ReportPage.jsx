import ReportCharts from '../components/Comps/ReportCharts';
import { MainLayout } from '../layout/MainLayout' ;
import { TbReport } from "react-icons/tb";
import { Row, Col } from 'react-bootstrap';


//* Report Page

export const ReportPage = () => {

    return (
        <MainLayout>

                <p className='fs-4'><span><TbReport /></span> Sales Report</p>
                
                <div className='contentReport' style={{border: "1px solid", height: "800px"}}>
                    <Row>
                        <Col className='colReport'>
                            <ReportCharts />
                        </Col>
                    </Row>
                </div>
        </MainLayout>
    )
}

export default ReportPage ;