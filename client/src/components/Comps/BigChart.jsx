import Reportcss from './CSS/Reportcomp.module.css';


//* Child 

const BigChart = ({bigreports}) => {


    return (
        <>
            {bigreports.map((bigreport) => (
                <div key={bigreport.id} className={Reportcss.contentBigchart}>
                    <p>{bigreport.title}</p>
                </div>
            ))}
        </>
    );
}

export default BigChart;
