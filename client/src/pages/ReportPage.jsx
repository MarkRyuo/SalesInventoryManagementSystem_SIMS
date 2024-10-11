/* eslint-disable no-unused-vars */
import ReportCharts from '../components/Comps/ReportCharts';
import { MainLayout } from '../layout/MainLayout';
import { TbReport } from "react-icons/tb";
import { Row, Col } from 'react-bootstrap';

import Reportcss from './Css/Report.module.css';
import { useState } from 'react';
import BigChart from '../components/Comps/BigChart';


//* Report Page

export const ReportPage = () => {


    return (
        <MainLayout>

            <p className='fs-4'><span><TbReport /></span> Sales Report</p>

            <div className={Reportcss.contentReport}>
                <Row className={Reportcss.rowReport}>
                    <Col lg={4} md={12}>
                        <ReportChart1 />
                    </Col>
                    <Col lg={4} md={12}>
                        <ReportCharts reports={reports.filter((report) => report.id === 2)} />
                    </Col>
                    <Col lg={4} md={12}>
                        <ReportCharts reports={reports.filter((report) => report.id === 3)} />
                    </Col>
                </Row>

                {/* Big-Charts */}
                <Row>
                    <Col>
                        <BigChart bigreports={bigreports.filter((bigreport) => bigreport.id === 4)} />
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