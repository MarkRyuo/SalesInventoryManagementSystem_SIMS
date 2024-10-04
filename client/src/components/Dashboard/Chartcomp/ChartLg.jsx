import chartcomp from './Chartcomp.module.css' ; //* Styling
import PropTypes from 'prop-types';

function ChartLg({chartlg}) {


    return (
        
        <div className ={chartcomp.containerChartlg} >
            {chartlg.map((chartlg) => (
                <div className={chartcomp.contentChartLg} key={chartlg.id}>
                    <p>{chartlg.title}</p>
                </div>
            ))}
        </div >
    )
}

// Fixing PropTypes definition
ChartLg.propTypes = {
    chartlg: PropTypes.arrayOf(
        PropTypes.shape({
            title: PropTypes.string.isRequired,
            id: PropTypes.string.isRequired
        })
    ).isRequired
};

export default ChartLg;
