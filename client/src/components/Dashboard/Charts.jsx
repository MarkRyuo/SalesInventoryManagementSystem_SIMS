import { Row, Col } from "react-bootstrap"
import Chart1 from "./Chartcomp/Chart1"
import Chart2 from "./Chartcomp/Chart2"
import Chart3 from "./Chartcomp/Chart3"



export const Charts = () => {


    return (
        <>
            <div className="mainChart">
                <Row>
                    <Col>
                        <Chart1 />
                    </Col>
                    <Col>
                        <Chart2 />
                    </Col>
                    <Col>
                        <Chart3 />
                    </Col>
                </Row>
            </div>
        </>
    )
}
