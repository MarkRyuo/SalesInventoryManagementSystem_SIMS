import { useState } from "react";


function Chart1({charts}) {

    return (
        <div className="mainContent">
            {charts.map((chart) => (
                <div className="contentChart" key={chart.id}>
                    <p>{chart.ChartTitle}</p>
                    <p>{chart.ChartNUmber}</p>
                </div>
            ))}
        </div>
    )
}

export default Chart1 ;
