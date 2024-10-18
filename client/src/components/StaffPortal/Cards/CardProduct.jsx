/* eslint-disable react/prop-types */


function CardProduct({cardProduct}) {

    return (
        <>
            {cardProduct.map((cardProducts) => (
                <div 
                    key={cardProducts.id} 
                    style={{width: 250, padding: 20, boxShadow: '1px 1px 5px ', borderRadius: 15, flexShrink: 0}}>
                    <span>{cardProducts.productIcon}</span>
                    <p className="fs-5 m-0">{cardProducts.productName}</p>
                    <p>{cardProducts.productValue}</p>
                </div>
            ))}
        </>
    )
}

export default CardProduct ;
