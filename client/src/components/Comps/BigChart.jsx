

//* Child 

const BigChart = ({bigreports}) => {


    return (
        <>
            {bigreports.map((bigreport) => (
                <div key={bigreport.id}>

                </div>
            ))}
        </>
    );
}

export default BigChart;
