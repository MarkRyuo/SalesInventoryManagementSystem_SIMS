import Chartcss from './Charts.module.scss';
import { FaReact } from "react-icons/fa";

//* Chart3 Small
function Chart4() {
    return (
        <div className={Chartcss.containerChart3}>
            <div className={Chartcss.containerText}>
                <FaReact size={25} />
                <p>Text Here</p>
            </div>
            <div className={Chartcss.contentChart}>
                <p>000000</p>
                <p>From the running month</p>
            </div>
        </div>
    )
}

export default Chart4;