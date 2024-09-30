


//* Reusable, Props 

const ReportCharts = ({Reportobj, title, total}) => {
    
    return (
        <>
            <div>
                {Reportobj.map((reports) => (
                    <div key={reports.id} className="contentReport">
                        <p>{title}</p>
                        <p>{total}</p>
                    </div>
                ))}
            </div>
        </>
    )
}

export default ReportCharts
