import Chartcss from './Charts.module.scss';
import { FaReact } from "react-icons/fa";

//* Chart2 Small
function Chart2() {
    return (
        <div className={Chartcss.containerChart2}>
            <div className={Chartcss.containerText}>
                <FaReact size={25} />
                <p className='m-0 p-0'>Text Here</p>
            </div>
            <div className={Chartcss.contentChart}>
                <p className='m-0 mt-2'>0</p>
                <p className='m-2'>From the running month</p>
            </div>
        </div>
    )
}

export default Chart2;
