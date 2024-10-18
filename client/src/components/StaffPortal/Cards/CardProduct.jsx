

function CardProduct({cardProduct}) 

    return (
        <>
            {cardProduct.map((cardProducts) => (
                <div key={cardProducts.id} style={{border: '1px solid red'}}>
                    <span>{cardProducts.productIcon}</span>
                    <p>{cardProducts.productName}</p>
                    <p>{cardProducts.productValue}</p>
                </div>
            ))}
        </>
    )
}

export default CardProduct
