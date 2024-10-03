import { useState } from "react";


function ChartLg({chartlg}) {

    const [chartlg, setChartlg] = useState([
        { title: "Chartlg1", id: "lg-1" },
        { title: "Chartlg2", id: "lg-2" }
    ])

    return (
        
        <div className = "containerChartlg" >
            {chartlg.map((chartlg) => (
                <div className="contentChartLg" key={chartlg.id}>
                    <p>{chartlg.title}</p>
                </div>
            ))}
        </div >
    )
}

export default Chart4;
