


//* Reusable, Props 

const ReportCharts = ({className}) => {
    
    return (
        <>
            <div className={className}>
                {Reportobj.map((reports) => (
                    <div key={reports.id}>

                    </div>
                ))}
            </div>
        </>
    )
}

export default ReportCharts
