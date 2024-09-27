import { Row, Col } from "react-bootstrap"
import Chart1 from "./Chartcomp/Chart1"
import Chart2 from "./Chartcomp/Chart2"
import Chart3 from "./Chartcomp/Chart3"

import DashStyle from './Dashboard.module.css'



export const Charts = () => {


    return (
        <>
            <div className="mainChart">
                <Row className="gap-5">
                    <Col lg={4} md={12} className={DashStyle.colChart}>
                        <Chart1 />
                    </Col>
                    <Col lg={4} md={12} className={DashStyle.colChart}>
                        <Chart2 />
                    </Col>
                    <Col lg={4} md={12} className={DashStyle.colChart}>
                        <Chart3 />
                    </Col>
                </Row>
            </div>
        </>
    )
}
