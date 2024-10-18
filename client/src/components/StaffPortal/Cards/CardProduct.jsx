/* eslint-disable react/prop-types */


function CardProduct({cardProduct}) {

    return (
        <>
            {cardProduct.map((cardProducts) => (
                <div key={cardProducts.id} style={{border: '1px solid red', width: 250, padding: 20}}>
                    <span>{cardProducts.productIcon}</span>
                    <p className="fs-5">{cardProducts.productName}</p>
                    <p>{cardProducts.productValue}</p>
                </div>
            ))}
        </>
    )
}

export default CardProduct ;
