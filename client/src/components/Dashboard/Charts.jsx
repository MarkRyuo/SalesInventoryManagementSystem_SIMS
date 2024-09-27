import { Row, Col } from "react-bootstrap"
import Chart1 from "./Chartcomp/Chart1"



export const Charts = () => {


    return (
        <>
            <div className="mainChart">
                <Row>
                    <Col>
                        <Chart1 />
                    </Col>
                </Row>
            </div>
        </>
    )
}
