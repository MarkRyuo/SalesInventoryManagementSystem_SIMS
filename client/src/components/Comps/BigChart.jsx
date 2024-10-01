

//* Child 

const BigChart = ({bigreports}) => {


    return (
        <>
            {bigreports.map((bigreport) => (
                <div key={bigreport.id}>
                    <TbDeviceIpadHorizontalPlus>{bigreport.title}</TbDeviceIpadHorizontalPlus>
                </div>
            ))}
        </>
    );
}

export default BigChart;
