/* eslint-disable react/prop-types */


function CardProduct({ cardProduct }) {

    return (
        <>
            {cardProduct.map((cardProducts) => (
                <div
                    key={cardProducts.id}
                    style={{
                        width: 250, 
                        padding: 20, 
                        boxShadow: '1px 1px 5px #e2dfdf', 
                        borderRadius: 15, 
                        flexShrink: 0, 
                        borderLeft: '2px solid #92E3B8' 
                    }}>
                    <span>{cardProducts.productIcon}</span>
                    <p className="fs-6 m-0">{cardProducts.productName}</p>
                    <p className="fs-6 m-0">{cardProducts.productValue}</p>
                </div>
            ))}
        </>
    )
}

export default CardProduct;
