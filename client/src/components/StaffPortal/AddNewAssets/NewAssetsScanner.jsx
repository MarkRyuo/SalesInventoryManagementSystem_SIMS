import { Container } from "react-bootstrap";

//? 1st See
function NewAssetsScanner() {

    return (
        <Container fluid>
            <Container fluid='md'>
                <div style={{border: '1px solid red'}}>
                    <div>
                        {/* Camera Here */}
                        <p>Place a Barcode/QRcode inside the rectangle to scan it</p>
                    </div>
                </div>
            </Container>
        </Container>
    )
}

export default NewAssetsScanner ;
