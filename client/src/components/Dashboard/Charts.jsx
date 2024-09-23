import { Row, Col } from "react-bootstrap"


export const Charts = () => {

    return (
        <>
            <div className="mainChart">
                <Row>
                    <Col lg={3}>
                        Col-1
                    </Col>
                    <Col lg={3}>
                        Col-2
                    </Col>
                    <Col>
                        Col-3
                    </Col>
                    <Col>
                        Col-4
                    </Col>
                </Row>
            </div>
        </>
    )
}
