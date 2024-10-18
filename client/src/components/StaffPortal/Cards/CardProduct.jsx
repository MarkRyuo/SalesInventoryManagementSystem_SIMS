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

        </>
    )
}

export default CardProduct
