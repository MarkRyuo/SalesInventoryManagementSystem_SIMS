import { FaReact } from "react-icons/fa";
import ReportChartcss from './ReportChart.module.scss'
//* ReportChart1 Small
function ReportChart4() {
    return (
        <div className={ReportChartcss.containerChart4}>
            <div className={ReportChartcss.containerText}>
                <FaReact size={25} />
                <p className='m-0 p-0'>Text Here</p>
            </div>
            <div className={ReportChartcss.contentChart}>
                <p className="fs-4">00000</p>
                <p>From the running month</p>
            </div>
        </div>
    )
}

export default ReportChart4;
