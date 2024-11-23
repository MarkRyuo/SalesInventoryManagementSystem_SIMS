import Chartcss from './Charts.module.scss';
import { FaReact } from "react-icons/fa";
//* Chart1 Small
function Chart1() {
    return (
        <div className={Chartcss.containerChart1}>
            <div className={Chartcss.containerText}>
                <FaReact size={25} />
                <p>Text Here</p>
            </div>
            <div className={Chartcss.contentChart}>
                <p>00000</p>
                <p>From the running month</p>
            </div>
        </div>
    )
}

export default Chart1;
