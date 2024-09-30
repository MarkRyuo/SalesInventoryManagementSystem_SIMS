import ReportCharts from '../components/Comps/ReportCharts';
import { MainLayout } from '../layout/MainLayout' ;
import { TbReport } from "react-icons/tb";
import { Row, Col } from 'react-bootstrap';

import Reportcss from './Css/Report.module.css' ;
import { useState } from 'react';


//* Report Page

export const ReportPage = () => {

    //* need Unique id 
    const [reports, setReport] = useState([
        { title: "Total Revenue", total: "$1000", id: 1 },
        { title: "Total Units Sold", total: "500 units", id: 2}
    ]) ;


    return (
        <MainLayout>

                <p className='fs-4'><span><TbReport /></span> Sales Report</p>
                
                <div className='contentReport' style={{border: "1px solid", height: "800px"}}>
                    <Row className='rowReport'>
                        <Col lg={4} className={Reportcss.colReport}>
                            <ReportCharts reports={reports.filter((report) => report.title === "Total Revenue") }/>  {/* Create module css here */}
                        </Col>
                        <Col>
                            
                        </Col>
                    </Row>
                </div>
        </MainLayout>
    )
}

export default ReportPage ;