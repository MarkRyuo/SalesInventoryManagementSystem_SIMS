import Chartcss from './Charts.module.css';

//* Chart3 Small
function Chart3() {
    return (
        <div className={Chartcss.containerContent}>
            <div>
                {/* Icon Here */}
                <p className='fs-5'>Text Here</p>
            </div>
            <div className={Chartcss.contentChart}>
                <p className="fs-4">000000</p>
                <p>From the running month</p>
            </div>
        </div>
    )
}

export default Chart3;
