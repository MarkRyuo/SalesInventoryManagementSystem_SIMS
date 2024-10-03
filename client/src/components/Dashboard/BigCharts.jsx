import ChartLg from './Chartcomp/ChartLg';
import DashStyle from './Dashboard.module.css' ;

import { Row, Col } from 'react-bootstrap';




function BigCharts() {
    return (
        <>
                <Row className={DashStyle.rowChartlg}>
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
