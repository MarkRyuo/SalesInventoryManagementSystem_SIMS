import { Container } from "react-bootstrap";

function NavbarCurrentOrder() {
    return (
        <Container fluid>
            <div>
                <p className="fs-4">Current Order</p>
                {/* Button direct scan if customer add another product to cashier */}
            </div>
        </Container>
    )
}

export default NavbarCurrentOrder ;
