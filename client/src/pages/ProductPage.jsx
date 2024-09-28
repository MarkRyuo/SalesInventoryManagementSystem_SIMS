import { Container} from "react-bootstrap";
import { MainLayout } from "../layout/MainLayout";
import { AiFillProduct } from "react-icons/ai";
import Search from "../components/Comps/Search";
//* Product Page

export const ProductPage = () => {

    return (
        <MainLayout>
            <Container fluid='lg'>
                <p className="fs-3"><span><AiFillProduct /></span>Product</p>
            </Container>
            <div>
                <div>
                    <Search />
                </div>

                <div>

                </div>
            </div>
        </MainLayout>
    )
}

export default ProductPage ;