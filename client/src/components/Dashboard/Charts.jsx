import { Row, Col } from "react-bootstrap"
import Chart1 from "./Chartcomp/Chart1"
import { useState } from "react"

import DashStyle from './Dashboard.module.css'


//* Prop Parent
export const Charts = () => {

    const [charts, SetCharts] = useState([
        { ChartTitle: "Chart1", ChartNumber: "$00000", id: "C-1" },
        { ChartTitle: "Chart2", ChartNumber: "$00000", id: "C-2" },
        { ChartTitle: "Chart3", ChartNumber: "$00000", id: "C-3" },

    ])

    return (
        <>
                <Row className={DashStyle.rowChart}>
                    <Col lg={4} md={12} className={DashStyle.colChart}>
                        <Chart1 charts={charts.filter((chart) => chart.id === "C-1")}/>
                    </Col>
                    <Col lg={4} md={12} className={DashStyle.colChart}>
                        <Chart1 charts={charts.filter((chart) => chart.id === "C-2")} />
                    </Col>
                    <Col lg={4} md={12} className={DashStyle.colChart}>
                        <Chart1 charts={charts.filter((chart) => chart.id === "C-3")} />
                    </Col>
                </Row>
        </>
    )
}
