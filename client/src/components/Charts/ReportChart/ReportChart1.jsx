import { FaReact } from "react-icons/fa";
import ReportChartcss from './ReportChart.module.scss'

//* ReportChart1 Small
function ReportChart1() {
    return (
        <div className={ReportChartcss.containerChart1}>
            <div className={ReportChartcss.containerText}>
                <FaReact size={25} />
                <p className='fs-5 m-0'>Text Here</p>
            </div>
            <div className={ReportChartcss.contentChart}>
                <p className="fs-4">00000</p>
                <p>From the running month</p>
            </div>
        </div>
    )
}

export default ReportChart1;
