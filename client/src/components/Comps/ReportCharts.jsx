


//* Reusable, Props 

const ReportCharts = ({reports}) => {
    
    return (
        <>
            <div>
                {reports.map((report) => (
                    <div key={report.id} className="contentReport">
                        <p>{title}</p>
                        <p>{total}</p>
                    </div>
                ))}
            </div>
        </>
    )
}

export default ReportCharts
