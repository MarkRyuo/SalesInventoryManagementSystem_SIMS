import { useState } from "react";


function Chart1() {

    const [charts, SetCharts] = useState([
        { ChartTitle: "Chart1", ChartNumber: "00000", id: "C-1" },
        { ChartTitle: "Chart2", ChartNumber: "00000", id: "C-2" },
        { ChartTitle: "Chart3", ChartNumber: "00000", id: "C-3" },

    ])

    return (
        <div className="mainContent">
            {charts.map((chart) => (
                <div className="contentChart">
                    <h1></h1>
                </div>
            ))}
        </div>
    )
}

export default Chart1 ;
