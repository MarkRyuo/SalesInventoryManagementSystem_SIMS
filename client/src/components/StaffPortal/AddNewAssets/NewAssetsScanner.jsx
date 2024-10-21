import { Container } from "react-bootstrap";

//? 1st See
function NewAssetsScanner() {

    return (
        <Container fluid>
            <Container fluid='md' className='' style={{border: '1px solid green'}}>
                <div style={{border: '1px solid red', padding: 20}}>
                    <div style={{border: '1px solid'}}>
                        <video ref={videoRef} style={{ width: '100%', height: 'auto' }} />
                        {/* Camera Here */}
                        <p className="fs-6">Place a Barcode/QRcode inside the rectangle to scan it</p>
                    </div>
                </div>
            </Container>
        </Container>
    )
}

export default NewAssetsScanner ;
