import Chartcss from './Charts.module.scss';
import { FaReact } from "react-icons/fa";

//* Chart3 Small
function Chart3() {
    return (
        <div className={Chartcss.containerChart3}>
            <div className={Chartcss.containerText}>
                <FaReact size={25} />
                <p className='m-0 p-0'>Text Here</p>
            </div>
            <div className={Chartcss.contentChart}>
                <p className='m-0 mt-2'>000000</p>
                <p className='m-2'>From the running month</p>
            </div>
        </div>
    )
}

export default Chart3;
