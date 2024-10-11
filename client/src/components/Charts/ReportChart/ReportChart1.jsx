import Chartcss from './Charts.module.css';
import { FaReact } from "react-icons/fa";

//* ReportChart1 Small
function Chart1() {
    return (
        <div className={Chartcss.containerChart1}>
            <div className={Chartcss.containerText}>
                <FaReact size={25} />
                <p className='fs-5 m-0'>Text Here</p>
            </div>
            <div className={Chartcss.contentChart}>
                <p className="fs-4">00000</p>
                <p>From the running month</p>
            </div>
        </div>
    )
}

export default Chart1;
