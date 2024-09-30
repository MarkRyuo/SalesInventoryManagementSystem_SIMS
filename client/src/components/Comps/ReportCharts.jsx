


//* Reusable, Props 

const ReportCharts = ({className, title, total}) => {

    return (
        <>
            <div className={className}>
                <p className="fs-4">{title}</p>
                <p className="fs-3 text-danger">{total}</p>
            </div>
        </>
    )
}

export default ReportCharts
