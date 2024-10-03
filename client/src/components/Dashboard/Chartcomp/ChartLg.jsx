


function ChartLg({chartlg}) {


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

export default ChartLg;
