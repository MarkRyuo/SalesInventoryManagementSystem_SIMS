import { useState } from "react";


function ChartLg() {

    const [chartlg, setChartlg] = useState([
        { title: "Chartlg1", id: "lg-1" },
        { title: "Chartlg2", id: "lg-2" }
    ])

    return (
        
        <div className = "containerChartlg" >
            {chartlg.map(() => (
                
            ))}
        </div >
    )
}

export default Chart4;
