import { useState } from "react"
import { LiaProductHunt } from "react-icons/lia";

function CardProduct() {

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
                <div key={cardProducts.id}>
                    <p>{cardProducts.productName}</p>
                </div>
            ))}
        </>
    )
}

export default CardProduct
