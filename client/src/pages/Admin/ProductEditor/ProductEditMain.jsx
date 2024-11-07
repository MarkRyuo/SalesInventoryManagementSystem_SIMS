import { Container, Navbar } from "react-bootstrap";
import ProductNavbarTabs from "./ProductNavbarTabs";
import ProductEditor from "./ProductEditor";

function ProductEditMain() {
    return (
        <Container fluid className="m-0 p-0">
            <Navbar className="bg-body-tertiary">
                <Container>
                    <Navbar.Brand href="#home">Brand link</Navbar.Brand>
                </Container>
            </Navbar>

            <div className="ProductMain">
                <ProductNavbarTabs />
                <div className="ProductContent">
                    <div className="ProductEditor">
                        <ProductEditor />
                    </div>
                </div>
            </div>
        </Container>
    )
}

export default ProductEditMain ;
