import { Row, Col } from "react-bootstrap"
import Chart1 from "./Chartcomp/Chart1"
import Chart2 from "./Chartcomp/Chart2"
import Chart3 from "./Chartcomp/Chart3"

import DashStyle from './Dashboard.module.css'



export const Charts = () => {


    return (
        <>
            <div className="mainChart">
                <Row>
                    <Col lg={4} md={12} className={DashStyle.colChart1}>
                        <Chart1 />
                    </Col>
                    <Col lg={4} md={12} className={DashStyle.colChart2}>
                        <Chart2 />
                    </Col>
                    <Col lg={4} md={12} className={DashStyle.colChart3}>
                        <Chart3 />
                    </Col>
                </Row>
            </div>
        </>
    )
}
