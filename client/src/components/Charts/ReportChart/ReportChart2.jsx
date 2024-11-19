import { FaReact } from "react-icons/fa";
import ReportChartcss from './ReportChart.module.scss'
//* ReportChart1 Small
function ReportChart2() {
    return (
        <div className={ReportChartcss.containerChart2}>
            <div className={ReportChartcss.containerText}>
                <FaReact size={25} />
                <p className='m-0 p-0'>Text Here</p>
            </div>
            <div className={ReportChartcss.contentChart}>
                <p className="m-0 p-2">0</p>
                <p className="m-0 pb-2">From the running month</p>
            </div>
        </div>
    )
}

export default ReportChart2;
