


//* Reusable, Props 

const ReportCharts = ({reports}) => {
    
    return (
        <>
            <div>
                {reports.map((report) => (
                    <div key={report.id} className="contentReport">
                        <p>{report.title}</p>
                        <p>{report.total}</p>
                    </div>
                ))}
            </div>
        </>
    )
}

export default ReportCharts
