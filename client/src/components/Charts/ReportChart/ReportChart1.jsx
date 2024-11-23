import { FaReact } from "react-icons/fa";
import ReportChartcss from './ReportChart.module.scss'

//* ReportChart1 Small
function ReportChart1() {
    return (
        <div className={ReportChartcss.containerChart1}>
            <div className={ReportChartcss.containerText}>
                <FaReact size={23} />
                <p className='m-0 p-0'>Text Here</p>
            </div>
            <div className={ReportChartcss.contentChart}>
                <p className="m-0 p-2">{/* Total Stock */}</p>
            </div>
        </div>
    )
}

export default ReportChart1;
