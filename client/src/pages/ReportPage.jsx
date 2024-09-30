import ReportCharts from '../components/Comps/ReportCharts';
import { MainLayout } from '../layout/MainLayout' ;
import { TbReport } from "react-icons/tb";
import { Row, Col } from 'react-bootstrap';

import Reportcss from './Css/Report.module.css' ;


//* Report Page

export const ReportPage = () => {

    const Reportobj = {
        Revenue : {title: "Total Revenue",total: "21"},
    }

    return (
        <MainLayout>

                <p className='fs-4'><span><TbReport /></span> Sales Report</p>
                
                <div className='contentReport' style={{border: "1px solid", height: "800px"}}>
                    <Row className='rowReport'>
                        <Col lg={4} className={Reportcss.colReport}>
                            <ReportCharts className={Reportcss.colContent} title={Reportobj.Revenue.title}/>  {/* Create module css here */}
                        </Col>

                        <Col lg={4} className={Reportcss.colReport}>
                            <ReportCharts className={Reportcss.colContent} />  {/* Create module css here */}
                        </Col>

                        <Col lg={4} className={Reportcss.colReport}>
                            <ReportCharts className={Reportcss.colContent} />  {/* Create module css here */}
                        </Col>
                    </Row>
                </div>
        </MainLayout>
    )
}

export default ReportPage ;