import { Container, Row, Col} from "react-bootstrap";
import { MainLayout } from "../layout/MainLayout";
import { AiFillProduct } from "react-icons/ai";
import Search from "../components/Comps/Search";
import ProductChart from "../components/Comps/ProductChart";
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
                    <ProductChart />
                </div>
            </div>
        </MainLayout>
    )
}

export default ProductPage ;