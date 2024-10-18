import { useState } from "react"
import { LiaProductHunt } from "react-icons/lia";

function CardProduct({cardProduct}) {

    const [cardProduct] = useState([
        {
            productIcon: <LiaProductHunt /> ,
            productName: '' ,
            productValue: '',
            id: 'p1'
        }
    ])

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
