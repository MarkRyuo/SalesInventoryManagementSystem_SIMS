// import { Row, Col } from "react-bootstrap"


// eslint-disable-next-line react/prop-types
export const Charts = ({ChartNumber}) => {


    return (
        <>
            <div className="mainChart">

                <div style={{border: "1px solid"}}>
                    {ChartNumber}
                </div>
                {/* <Row>
                    <Col lg={3} md={6} style={{border: "1px solid", height: "150px"}}>
                        Col-1
                    </Col>
                    <Col lg={3} md={6} style={{border: "1px solid", height: "150px"}}>
                        Col-2
                    </Col>
                    <Col lg={3} md={6} style={{border: "1px solid", height: "150px"}}>
                        Col-3
                    </Col>
                    <Col lg={3} md={6} style={{border: "1px solid", height: "150px"}}>
                        Col-4
                    </Col>
                </Row> */}
            </div>
        </>
    )
}
