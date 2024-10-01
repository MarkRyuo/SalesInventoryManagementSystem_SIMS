

//* Child 

const BigChart = ({bigreports}) => {


    return (
        <>
            {bigreports.map((bigreport) => (
                <div key={bigreport.id} style={{border: "1px solid", height: "400px", marginTop: "10px"}}>
                    <p>{bigreport.title}</p>
                </div>
            ))}
        </>
    );
}

export default BigChart;
