


function Chart1({charts}) {

    return (
        <div className="mainContent">
            {charts.map((chart) => (
                <div className="contentChart" key={chart.id}>
                    <p>{chart.ChartTitle}</p>
                    <p>{chart.ChartNumber}</p>
                </div>
            ))}
        </div>
    )
}

export default Chart1 ;
