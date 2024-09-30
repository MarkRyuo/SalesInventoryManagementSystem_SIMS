
import Reportcss from './CSS/Reportcomp.module.css' ;


//* Reusable, Props 

const ReportCharts = ({reports}) => {
    
    return (
        <>
            <div>
                {reports.map((report) => (
                    <div key={report.id} className={Reportcss.contentReport}>  {/*Parent */}
                        <p className="fs-4">{report.title}</p> {/* Child */}
                        <p className="fs-6">{report.total}</p> 
                    </div>
                ))} 
            </div>
        </>
    )
}

export default ReportCharts ;
