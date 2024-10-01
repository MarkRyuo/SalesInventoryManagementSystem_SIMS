import ReportCharts from '../components/Comps/ReportCharts';
import { MainLayout } from '../layout/MainLayout';
import { TbReport } from "react-icons/tb";
import { Row, Col } from 'react-bootstrap';

import Reportcss from './Css/Report.module.css';
import { useState } from 'react';
import BigChart from '../components/Comps/BigChart';


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
        { title: "Bigchart2", id: 5 }
    ])


    return (
        <MainLayout>

            <p className='fs-4'><span><TbReport /></span> Sales Report</p>

            <div className={Reportcss.contentReport}>
                <Row className={Reportcss.rowReport}>
                    <Col lg={4}>
                        <ReportCharts reports={reports.filter((report) => report.id === 1)} />  {/* Create module css here */}
                    </Col>
                    <Col lg={4}>
                        <ReportCharts reports={reports.filter((report) => report.id === 2)} />
                    </Col>
                    <Col lg={4}>
                        <ReportCharts reports={reports.filter((report) => report.id === 3)} />
                    </Col>
                </Row>

                <Row>
                    <Col lg={7}>
                        <BigChart bigreports={bigreports.filter((bigreport) => bigreport.id === 4)}/>
                    </Col>
                    <Col lg={5}>
                        <BigChart bigreports={bigreports.filter((bigreport) => bigreport.id === 5)} />
                    </Col>
                </Row>
            </div>
        </MainLayout>
    )
}

export default ReportPage;