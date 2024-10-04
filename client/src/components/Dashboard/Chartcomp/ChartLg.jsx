import chartcomp from './Chartcomp.module.css' ;


function ChartLg({chartlg}) {


    return (
        
        <div className = "containerChartlg" style={{border: "1px solid", width: "100%", minWidth: "500px"}} >
            {chartlg.map((chartlg) => (
                <div className="contentChartLg" key={chartlg.id} style={{border: "1px solid", width: "100%", height: "380px"}}>
                    <p>{chartlg.title}</p>
                </div>
            ))}
        </div >
    )
}

export default ChartLg;
