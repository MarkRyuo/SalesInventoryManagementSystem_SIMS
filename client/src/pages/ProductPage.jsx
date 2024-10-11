import { Container, Row, Col } from "react-bootstrap";
import { MainLayout } from "../layout/MainLayout";
import { AiFillProduct } from "react-icons/ai";
import ProductChart from "../components/Comps/ProductChart";
import Productcss from './Css/Product.module.css';
import ProductCategory from "../components/Comps/ProductCategory";


//* Product Page

export const ProductPage = () => {

    return (
        <MainLayout>
            <p className="fs-3"><span><AiFillProduct /></span>Product</p> {/*  */}

            <Row className={Productcss.containerProduct}>
                <Col lg={12} className={Productcss.colProduct}>
                    <ProductChart />
                </Col>
            </Row>
        </MainLayout>
    )
}

export default ProductPage;