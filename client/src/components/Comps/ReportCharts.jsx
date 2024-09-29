


//* Reusable, Props 

const ReportCharts = () => {

    const title = "Total Revenue" ;
    const number = "$1000" ;

    return (
        <>
            <div className="contentChart">
                <p className="fs-4">{title}</p>
                <p className="fs-3 text-danger">{number}</p>
            </div>
        </>
    )
}

export default ReportCharts
