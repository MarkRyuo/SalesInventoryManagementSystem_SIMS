


//* Reusable, Props 

const ReportCharts = ({reports}) => {
    
    return (
        <>
            <div>
                {reports.map((report) => (
                    <div key={report.id} className="contentReport">  {/*Parent */}
                        <p className="">{report.title}</p> {/* Child */}
                        <p className="">{report.total}</p>
                    </div>
                ))} 
            </div>
        </>
    )
}

export default ReportCharts
