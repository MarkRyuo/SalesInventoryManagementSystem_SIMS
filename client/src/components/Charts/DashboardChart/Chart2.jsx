import Chartcss from './Charts.module.css';

//* Chart2 Small
function Chart2() {
    return (
        <div className={Chartcss.containerContent}>
            <div>
                {/* Icon Here */}
                <p className='fs-4'>Text Here</p>
            </div>
            <div className={Chartcss.contentChart}>
                <p className="fs-4">Chart2</p>
                <p className="fs-5">From the running month</p>
            </div>
        </div>
    )
}

export default Chart2;
