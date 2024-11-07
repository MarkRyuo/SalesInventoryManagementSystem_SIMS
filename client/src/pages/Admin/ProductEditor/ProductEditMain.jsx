import { Container, Navbar, Button } from "react-bootstrap";
import ProductNavbarTabs from "./ProductNavbarTabs";
import ProductEditor from "./ProductEditor";
import { IoMdArrowRoundBack } from "react-icons/io";
import { Link } from "react-router-dom";

function ProductEditMain() {
    return (
        <Container fluid className="m-0 p-0">
            <Navbar className="bg-body-tertiary">
                <Container>
                    <Button as={Link} variant="light" to={"/DashboardPage"}><IoMdArrowRoundBack size={20} /></Button>
                </Container>
            </Navbar>

            <Container className="ProductMain">
                <ProductNavbarTabs />
                <div className="ProductContent">
                    <div className="ProductEditor">
                        <ProductEditor />
                    </div>
                </div>
            </Container>
        </Container>
    )
}

export default ProductEditMain ;
