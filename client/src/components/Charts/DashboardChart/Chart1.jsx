import Chartcss from './Charts.module.css' ;

//* Chart1 Small
function Chart1() {
    return (
        <div className={Chartcss.containerContent}>
                <div>
                    {/* Icon Here */}
                    <p className='fs-5'>Text Here</p>
                </div>
                <div className={Chartcss.contentChart}>
                    <p className="fs-4">00000</p>
                    <p className="">From the running month</p>
                </div>
        </div>
    )
}

export default Chart1 ;
