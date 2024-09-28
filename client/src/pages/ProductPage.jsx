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

                <div className={Productcss.containerProduct}>
                    <Row>
                        <Col lg={12} style={{ border: "1px solid", height: "500px", overflow: "auto", width: '100%' }}>
                        <ProductChart />
                        </Col>
                    </Row>
                </div>
            </div>
        </MainLayout>
    )
}

export default ProductPage ;