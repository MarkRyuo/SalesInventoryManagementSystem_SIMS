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
            <div className={Reportcss.reportMain}>
                <div>
                    <p className='fs-4 m-4'><span><TbReport /></span> Sales Report</p>
                </div>
                <div className={Reportcss.rowReport}>
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
                <div className={Reportcss.rowContainerLg}>
                    <div className={Reportcss.colContainerLg} sm={12} lg={8}>
                        <ReportChartLg1 />
                    </div>
                    <div className={Reportcss.colContainerLg} xs={10} lg={5} >
                        <ReportChartLg2 />
                    </div>
                </div>
            </div>

        </MainLayout>
    )
}

export default ReportPage;