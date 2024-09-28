import { Row, col } from "react-bootstrap"

function ProductChart() {
    return (
        <>
            <Row>
                <Col>
                    <div style={{ width: "100%", height: "400px", overflow: "auto", border: "1px solid", maxWidth: "500px" }}>
                        Scrollable
                    </div>
                </Col>
            </Row>
        </>
    )
}

export default ProductChart
