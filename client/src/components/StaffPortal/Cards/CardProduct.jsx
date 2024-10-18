import { useState } from "react"
import { LiaProductHunt } from "react-icons/lia";

function CardProduct() {

    const [cardProduct] = useState([
        {
            productIcon: <LiaProductHunt /> ,
            productName: '' ,
            productValue: '',
        }
    ])

    return (
        <>
            {cardProduct.map((cardProducts) => (
                
            ))}
        </>
    )
}

export default CardProduct
