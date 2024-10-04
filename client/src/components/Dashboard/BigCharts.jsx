import ChartLg from './Chartcomp/ChartLg';
import DashStyle from './Dashboard.module.css';
import { useState } from 'react';
import { Row, Col } from 'react-bootstrap';




function BigCharts() {

    const [chartlg, setChartlg] = useState([
        { title: "Chartlg1", id: "lg-1" },
        { title: "Chartlg2", id: "lg-2" }
    ])

    return (
        <>
            <Row className={DashStyle.rowChartlg}>
                <Col lg={7} md={12} sm={12} className={DashStyle.colChartlg}>
                    <ChartLg chartlg={chartlg.filter((chartlg) => chartlg.id === "lg-1")} />
                </Col>
                <Col lg={5} sm={7} className={DashStyle.colChartlg}>
                    <ChartLg chartlg={chartlg.filter((chartlg) => chartlg.id === "lg-2")} />
                </Col>
            </Row>
        </>
    )
}

export default BigCharts;
