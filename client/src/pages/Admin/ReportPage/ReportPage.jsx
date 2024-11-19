import { MainLayout } from '../../../layout/MainLayout';
import { TbReport } from "react-icons/tb";

import Reportcss from './Report.module.scss';
import ReportChart1 from '../../../components/Charts/ReportChart/ReportChart1'
import ReportChart2 from '../../../components/Charts/ReportChart/ReportChart2';
import ReportChart3 from '../../../components/Charts/ReportChart/ReportChart3';
import ReportChart4 from '../../../components/Charts/ReportChart/ReportChart4';
import ReportChartLg1 from '../../../components/Charts/ReportChart/ReportChartLg1';
import ReportChartLg2 from '../../../components/Charts/ReportChart/ReportChartLg2';
import { Container } from 'react-bootstrap';


//* Report Page

export const ReportPage = () => {


    return (
        <MainLayout>
            <Container className={Reportcss.reportMain}>
                <div className={Reportcss.reportTitle}>
                    <h5 className='m-0 p-o'><span><TbReport /></span> Sales Report</h5>
                </div>
                <div className={Reportcss.containerReportSmall}>
                    <div>
                        <ReportChart1 />
                    </div>
                    <div>
                        <ReportChart2 />
                    </div>
                    <div>
                        <ReportChart3 />
                    </div>
                    <div>
                        <ReportChart4 />
                    </div>
                </div>

                {/* Big-Charts */}
                <div className={Reportcss.containerReportLarge}>
                    <div className={Reportcss.colContainerLarge}>
                        <ReportChartLg1 />
                    </div>
                    <div className={Reportcss.colContainerLarge}>
                        <ReportChartLg2 />
                    </div>
                </div>
            </Container>

        </MainLayout>
    )
}

export default ReportPage;