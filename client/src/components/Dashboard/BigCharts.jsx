import Chart4 from './Chartcomp/Chart4';
import Chart5 from './Chartcomp/Chart5';
import DashStyle from './Dashboard.module.css' ;

import { Row, Col } from 'react-bootstrap';




function BigCharts() {
    return (
        <>
            <div style={{ border: "1px solid " }}>
                <Row>
                    <Col lg={5} className={DashStyle.colChartlg}>
                        <Chart4 />
                    </Col>
                    <Col lg={4} className={DashStyle.colChartlg}>
                        <Chart5 />
                    </Col>
                </Row>
            </div>
        </>
    )
}

export default BigCharts
