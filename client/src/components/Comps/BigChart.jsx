

//* Child 

const BigChart = ({bigreports}) => {


    return (
        <>
            {bigreports.map((bigreport) => (
                <div key={bigreport.id}>
                    <p>{bigreport.title}</p>
                </div>
            ))}
        </>
    );
}

export default BigChart;
