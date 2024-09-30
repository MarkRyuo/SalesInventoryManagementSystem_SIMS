


//* Reusable, Props 

const ReportCharts = ({className}) => {
    
    return (
        <>
            <div>
                {Reportobj.map((reports) => (
                    <div key={reports.id} className="">

                    </div>
                ))}
            </div>
        </>
    )
}

export default ReportCharts
