import { useState } from "react";


function ChartLg() {

    const [chartlg, setChartlg] = useState([
        {title: "Chartlg1", id: "lg-1"},
        {title: "Chartlg2"}
    ])

    return (
        <>
            <div className="contentChart4"> 
                Chart4
                {/* Insert Logic */}
            </div>
        </>
    )
}

export default Chart4 ;
