import Chartcss from './Charts.module.css' ;

//* Chart1 Small
function Chart1() {
    return (
        <div className={Chartcss.containerContent}>
                <div className="contentChart" style={{ border: "1px solid", textAlign: "center", height: "150px", alignContent: "center", borderRadius: "10px" }}>
                    <p className="fs-4">Chart1</p>
                    <p className="fs-5">$0000</p>
                </div>
        </div>
    )
}

export default Chart1 ;
