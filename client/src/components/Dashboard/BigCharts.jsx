import Chart4 from './Chartcomp/Chart4';
import Chart5 from './Chartcomp/Chart5';
import DashStyle from './Dashboard.module.css' ;

import { Row, Col } from 'react-bootstrap';




function BigCharts() {
    return (
        <>
                <Row>
                    <Col lg={7} className={DashStyle.colChartlg}>
                        <Chart4 />
                    </Col>
                    <Col lg={5} className={DashStyle.colChartlg}>
                        <Chart5 />
                    </Col>
                </Row>
        </>
    )
}

export default BigCharts ;
