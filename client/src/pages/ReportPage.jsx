/* eslint-disable no-unused-vars */
import ReportCharts from '../components/Comps/ReportCharts';
import { MainLayout } from '../layout/MainLayout';
import { TbReport } from "react-icons/tb";
import { Row, Col } from 'react-bootstrap';

import Reportcss from './Css/Report.module.css';
import { useState } from 'react';
import BigChart from '../components/Comps/BigChart';
import ReportChart1 from '../components/Charts/ReportChart/ReportChart1'
import ReportChart2 from '../components/Charts/ReportChart/ReportChart2';
import ReportChart3 from '../components/Charts/ReportChart/ReportChart3';
import ReportChart4 from '../components/Charts/ReportChart/ReportChart4';


//* Report Page

export const ReportPage = () => {


    return (
        <MainLayout>

            <p className='fs-4'><span><TbReport /></span> Sales Report</p>

            <Row className={Reportcss.rowReport}>
                <Col lg={6} md={12}>
                    <ReportChart1 />
                </Col>
                <Col lg={4} md={12}>
                    <ReportChart2 />
                </Col>
                <Col lg={6} md={12}>
                    <ReportChart3 />
                </Col>
                <Col lg={4} md={12}>
                    <ReportChart4 />
                </Col>
            </Row>

            {/* Big-Charts */}
            <Row>
                <Col>

                </Col>
                <Col lg={5}>

                </Col>
            </Row>

        </MainLayout>
    )
}

export default ReportPage;