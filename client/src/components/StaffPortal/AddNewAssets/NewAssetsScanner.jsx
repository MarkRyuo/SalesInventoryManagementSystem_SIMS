import { Container } from "react-bootstrap";

//? 1st See
function NewAssetsScanner() {

    return (
        <Container fluid className="p-0">
            <Container fluid='sm' className='' style={{ border: '1px solid green', minWidth: 400, padding: 2}}>
                <div style={{border: '1px solid red', padding: 0}}>
                    <div style={{border: '1px solid', width: 'auto'}}>
                        <video style={{ width: '100%', height: '80vh', border: '1px solid red'}} />
                        {/* Camera Here */}
                        <p className="fs-6">Place a Barcode/QRcode inside the rectangle to scan it</p>
                    </div>
                </div>
            </Container>
        </Container>
    )
}

export default NewAssetsScanner ;
