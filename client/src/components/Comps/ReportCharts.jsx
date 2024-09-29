


//* Reusable, Props 

const ReportCharts = ({className}) => {

    const title = "Total Revenue" ;
    const number = "$1000" ;

    return (
        <>
            <div className={className}>
                <p className="fs-4">{title}</p>
                <p className="fs-3 text-danger">{number}</p>
            </div>
        </>
    )
}

export default ReportCharts
