

//* Child 

const BigChart = ({bigreports}) => {


    return (
        <>
            {bigreports.map((bigreport) => (
                <div key={bigreport.id}>
                    <h1>{bigreport.title}</h1>
                </div>
            ))}
        </>
    );
}

export default BigChart;
