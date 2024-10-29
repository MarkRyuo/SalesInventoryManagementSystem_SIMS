import { Container, Navbar } from "react-bootstrap";

//* Inputs
function ScanAssetsMode() {
    return (
        <Container fluid className="m-0 p-0">
            <Navbar className="bg-body-tertiary">
                <Container>
                    <p className="fs-4 m-0">Current Order</p>
                    {/* Button direct scan if customer add another product to cashier */}
                </Container>
            </Navbar>
            <Container fluid='md'>
                {/* Logic Product scanned */}
                {/* list of products scanned */}
            </Container>
        </Container>
    )
}

export default ScanAssetsMode ;
