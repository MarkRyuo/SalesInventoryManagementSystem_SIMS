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
            </Container>
            <div>
                <div>
                    <Row>
                        <Col>
                            <Search />
                        </Col>
                    </Row>
                </div>

                <div>
                    <Row className={Productcss.containerProduct}>
                        <Col lg={5} style={{ border: "1px solid", height: "500px", overflow: "auto" }}>
                            <ProductChart />
                        </Col>
                    </Row>
                </div>
            </div>
        </MainLayout>
    )
}

export default ProductPage ;