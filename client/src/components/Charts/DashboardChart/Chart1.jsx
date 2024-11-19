import Chartcss from './Charts.module.scss';
import { FaReact } from "react-icons/fa";
//* Chart1 Small
function Chart1() {
    return (
        <div className={Chartcss.containerChart1}>
                <div className={Chartcss.containerText}>
                    <FaReact size={25}/>
                    <p className='m-0 p-0'>Text Here</p>
                </div>
                <div className={Chartcss.contentChart}>
                    <p>0</p>
                    <p>From the running month</p>
                </div>
        </div>
    )
}

export default Chart1 ;
