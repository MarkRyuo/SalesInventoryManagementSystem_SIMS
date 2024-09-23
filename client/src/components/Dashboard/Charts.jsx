import { Row, Col } from "react-bootstrap"


export const Charts = () => {

    return (
        <>
            <div className="mainChart">
                <Row>
                    <Col lg={3} md={12} style={{border: "1px solid", height: "200px"}}>
                        Col-1
                    </Col>
                    <Col lg={3} md={12} style={{border: "1px solid", height: "200px"}}>
                        Col-2
                    </Col>
                    <Col lg={3} md={12} style={{border: "1px solid", height: "200px"}}>
                        Col-3
                    </Col>
                    <Col lg={3} md={12} style={{border: "1px solid"}}>
                        Col-4
                    </Col>
                </Row>
            </div>
        </>
    )
}
