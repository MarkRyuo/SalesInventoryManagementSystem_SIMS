import { Container, Navbar } from "react-bootstrap";
import { useLocation } from "react-router-dom";

function ScanAssetsMode() {
    const location = useLocation();
    const scannedItems = location.state?.scannedItems || []; // Get scanned items from state

    return (
        <Container fluid className="m-0 p-0">
            <Navbar className="bg-body-tertiary">
                <Container>
                    <p className="fs-4 m-0">Current Order</p>
                </Container>
            </Navbar>
            <Container fluid='md'>
                {/* List of products scanned */}
                {scannedItems.length > 0 ? (
                    <ul>
                        {scannedItems.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                ) : (
                    <p>No items scanned yet.</p>
                )}
            </Container>
        </Container>
    );
}

export default ScanAssetsMode;
