import Chartcss from './Charts.module.css' ;

//* Chart1 Small
function Chart1() {
    return (
        <div className={Chartcss.containerContent}>
                <div>
                    <p>Text Here</p>
                </div>
                <div className={Chartcss.contentChart}>
                    <p className="fs-4">Chart1</p>
                    <p className="fs-5">$0000</p>
                </div>
        </div>
    )
}

export default Chart1 ;
