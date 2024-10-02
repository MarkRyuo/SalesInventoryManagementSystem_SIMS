


function Chart1({charts}) {

    return (
        <div className="mainContent">
            {charts.map((chart) => (
                <div className="contentChart" key={chart.id} style={{border: "1px solid", textAlign:"center", height: "150px", alignContent: "center"}}>
                    <p className="fs-4">{chart.ChartTitle}</p>
                    <p className="fs-5">{chart.ChartNumber}</p>
                </div>
            ))}
        </div>
    )
}

export default Chart1 ;
