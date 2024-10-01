import ReportCharts from '../components/Comps/ReportCharts';
import { MainLayout } from '../layout/MainLayout';
import { TbReport } from "react-icons/tb";
import { Row, Col } from 'react-bootstrap';

import Reportcss from './Css/Report.module.css';
import { useState } from 'react';


//* Report Page

export const ReportPage = () => {

    //* need Unique id 
    const [reports, setReport] = useState([
        { title: "Total Revenue", total: "$1000", id: 1 },
        { title: "Total Units Sold", total: "500 units", id: 2 },
        { title: "No. of Transactions", total: "2000 Transaction", id: 3 },
    ]);

    const [bigreports, setBigrepots] = useState([
        {title: "Bigchart1", id: 4},
        { title: "Bigchart1", id: 5 }
    ])


    return (
        <MainLayout>

            <p className='fs-4'><span><TbReport /></span> Sales Report</p>

            <div className={Reportcss.contentReport}>
                <Row className={Reportcss.rowReport}>
                    <Col lg={4}>
                        <ReportCharts reports={reports.filter((report) => report.title === "Total Revenue")} />  {/* Create module css here */}
                    </Col>
                    <Col lg={4}>
                        <ReportCharts reports={reports.filter((report) => report.title === "Total Units Sold")} />
                    </Col>
                    <Col lg={4}>
                        <ReportCharts reports={reports.filter((report) => report.title === "No. of Transactions")} />
                    </Col>
                </Row>
            </div>
        </MainLayout>
    )
}

export default ReportPage;