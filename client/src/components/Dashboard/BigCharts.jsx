import Chart4 from './Chartcomp/Chart4';
import Chart5 from './Chartcomp/Chart5';
import DashStyle from './Dashboard.module.css' ;

import { Row, Col } from 'react-bootstrap';




function BigCharts() {
    return (
        <div>
            <Row>
                <Col lg={8} className={DashStyle.colChartlg}>
                    <Chart4 />
                </Col>
                <Col className={DashStyle.colChartlg}>
                    <Chart5 />
                </Col>
            </Row>
        </div>
    )
}

export default BigCharts
