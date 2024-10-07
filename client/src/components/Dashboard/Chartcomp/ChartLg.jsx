/* eslint-disable react/prop-types */
import chartcomp from './Chartcomp.module.css' ; //* Styling


function ChartLg({chartlg}) {


    return (
        
        <div className ={chartcomp.containerChartlg} >
            {chartlg.map((chartlg) => (
                <div className={chartcomp.contentChartLg} key={chartlg.id}>
                    <p>{chartlg.title}</p>
                </div>
            ))}
        </div >
    )
}

export default ChartLg;
