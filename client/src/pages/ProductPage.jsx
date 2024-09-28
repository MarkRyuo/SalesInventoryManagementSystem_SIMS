import { Container, Row, Col} from "react-bootstrap";
import { MainLayout } from "../layout/MainLayout";
import { AiFillProduct } from "react-icons/ai";
import Search from "../components/Comps/Search";
import ProductChart from "../components/Comps/ProductChart";

import Productcss from './Css/Product.module.css' ;


//* Product Page

export const ProductPage = () => {

    return (
        <MainLayout>
            <Container fluid='lg'>
                <p className="fs-3"><span><AiFillProduct /></span>Product</p>
                    <Row>
                        <Col>
                            <Search />
                            </Col>
                        </Row>

                        <Row className={Productcss.containerProduct}>
                            <Col lg={12} className={Productcss.colProduct}>
                                <ProductChart />
                            </Col>
                        </Row>
            </Container>
        </MainLayout>
    )
}

export default ProductPage ;