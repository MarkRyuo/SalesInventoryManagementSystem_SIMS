import Chartcss from './Charts.module.css';
import { FaReact } from "react-icons/fa";

//* Chart2 Small
function Chart2() {
    return (
        <div className={Chartcss.containerChart2}>
            <div className={Chartcss.containerText}>
                <FaReact size={25} />
                <p className='fs-5 m-0'>Text Here</p>
            </div>
            <div className={Chartcss.contentChart}>
                <p className="fs-4">000000</p>
                <p>From the running month</p>
            </div>
        </div>
    )
}

export default Chart2;
