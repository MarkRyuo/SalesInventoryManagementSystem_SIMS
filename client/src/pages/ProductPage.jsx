
import { MainLayout } from "../layout/MainLayout";
import { AiFillProduct } from "react-icons/ai";
import Product from '../components/Charts/ProductChart/Product'

//* Product Page

export const ProductPage = () => {

    return (
        <MainLayout>
            <p className="fs-3"><span><AiFillProduct /></span>Product</p> {/*  */}

            <div>
                <Product />
            </div>
        </MainLayout>
    )
}

export default ProductPage;