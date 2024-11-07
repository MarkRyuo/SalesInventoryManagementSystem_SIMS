import { MainLayout } from "../layout/MainLayout";
import { AiFillProduct } from "react-icons/ai";
import Product from '../components/Charts/ProductChart/Product'
import { Container } from "react-bootstrap";
import ProductNavbarTabs from "./Admin/ProductEditor/ProductNavbarTabs";
import ProductEditor from "./Admin/ProductEditor/ProductEditor";

//* Product Page

export const ProductPage = () => {

    return (
        <MainLayout>
            <Container className="ProductMain">
                <ProductNavbarTabs />
                <div className="ProductContent">
                    <div className="ProductEditor">
                    </div>
                    <div className="ProductEditor">
                        <ProductEditor />
                    </div>
                </div>
            </Container>
            <p className="fs-3 ms-3"><span><AiFillProduct /></span>Product</p> {/*  */}
            <div>
                <Product />
            </div>
        </MainLayout>
    )
}

export default ProductPage;