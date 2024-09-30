


//* Reusable, Props 

const ReportCharts = ({reports}) => {
    
    return (
        <>
            <div>
                {reports.map((report) => (
                    <div key={report.id} className="contentReport">  {/*Parent */}
                        <p>{report.title}</p> {/* Childs */}
                        <p>{report.total}</p>
                    </div>
                ))}
            </div>
        </>
    )
}

export default ReportCharts
