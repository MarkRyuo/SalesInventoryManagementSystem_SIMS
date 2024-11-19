import { MainLayout } from '../../../layout/MainLayout';
import { TbReport } from "react-icons/tb";
import { Row, Col } from 'react-bootstrap';

import Reportcss from './Report.module.scss';
import ReportChart1 from '../../../components/Charts/ReportChart/ReportChart1'
import ReportChart2 from '../../../components/Charts/ReportChart/ReportChart2';
import ReportChart3 from '../../../components/Charts/ReportChart/ReportChart3';
import ReportChart4 from '../../../components/Charts/ReportChart/ReportChart4';
import ReportChartLg1 from '../../../components/Charts/ReportChart/ReportChartLg1';
import ReportChartLg2 from '../../../components/Charts/ReportChart/ReportChartLg2';


//* Report Page

export const ReportPage = () => {


    return (
        <MainLayout>

            <p className='fs-4 m-4'><span><TbReport /></span> Sales Report</p>

            <Row className={Reportcss.rowReport}>
                <Col lg={6} md={12}>
                    <ReportChart1 />
                </Col>
                <Col lg={5} md={12}>
                    <ReportChart2 />
                </Col>
                <Col lg={6} md={12}>
                    <ReportChart3 />
                </Col>
                <Col lg={5} md={12}>
                    <ReportChart4 />
                </Col>
            </Row>

            {/* Big-Charts */}
            <Row className={Reportcss.rowContainerLg}>
                <Col className={Reportcss.colContainerLg} sm={12} lg={8}>
                    <ReportChartLg1 />
                </Col>
                <Col className={Reportcss.colContainerLg} xs={10} lg={5} >
                    <ReportChartLg2 />
                </Col>
            </Row>

        </MainLayout>
    )
}

export default ReportPage;