import { Row, Col } from "react-bootstrap"


export const Charts = () => {

    return (
        <>
            <div className="mainChart">
                <Row>
                    <Col lg={3} md={6} style={{border: "1px solid", height: "200px", margin: "5px"}}>
                        Col-1
                    </Col>
                    <Col lg={3} md={6} style={{border: "1px solid", height: "200px", margin: "5px"}}>
                        Col-2
                    </Col>
                    <Col lg={3} md={6} style={{border: "1px solid", height: "200px", margin: "5px"}}>
                        Col-3
                    </Col>
                    <Col lg={3} md={6} style={{border: "1px solid", height: "200px", margin: "5px"}}>
                        Col-4
                    </Col>
                </Row>
            </div>
        </>
    )
}
