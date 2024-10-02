import { useState } from "react";


function Chart1() {

    const [Chart, SetChart] = useState([
        { ChartTitle: "Chart1", ChartNumber: "00000", id: "C-1" },
        { ChartTitle: "Chart2", ChartNumber: "00000", id: "C-2" },
        { ChartTitle: "Chart3", ChartNumber: "00000", id: "C-3" },

    ])

    return (
            <div className="contentChart1">
                
            </div>

    )
}

export default Chart1 ;
