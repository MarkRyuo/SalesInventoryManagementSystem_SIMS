import { Container} from "react-bootstrap";
import { MainLayout } from "../layout/MainLayout";
import { AiFillProduct } from "react-icons/ai";
//* Product Page

export const ProductPage = () => {

    return (
        <MainLayout>
            <Container fluid='lg'>
                <p className="fs-3"><span><AiFillProduct /></span>Product</p>
            </Container>
            <div>
                <div>
                    
                </div>

                <div>

                </div>
            </div>
        </MainLayout>
    )
}

export default ProductPage ;