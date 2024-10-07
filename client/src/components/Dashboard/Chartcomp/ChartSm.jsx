


function ChartSm({charts}) {

    return (
        <div className="containerContent">
            {charts.map((chart) => (
                <div className="contentChart" key={chart.id} style={{border: "1px solid", textAlign:"center", height: "150px", alignContent: "center", borderRadius: "10px"}}>
                    <p className="fs-4">{chart.ChartTitle}</p>
                    <p className="fs-5">{chart.ChartNumber}</p>
                </div>
            ))}
        </div>
    )
}

export default ChartSm ;
