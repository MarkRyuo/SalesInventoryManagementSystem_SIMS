import { Container, Navbar } from "react-bootstrap";

function ProductMain() {
    return (
        <Container fluid className="m-0 p-0">
            <Navbar className="bg-body-tertiary">
                <Container>
                    <Navbar.Brand href="#home">Brand link</Navbar.Brand>
                </Container>
            </Navbar>
        </Container>
    )
}

export default ProductMain ;
