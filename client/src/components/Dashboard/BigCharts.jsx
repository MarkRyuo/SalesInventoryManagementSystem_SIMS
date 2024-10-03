import ChartLg from './Chartcomp/ChartLg';
import DashStyle from './Dashboard.module.css' ;

import { Row, Col } from 'react-bootstrap';




function BigCharts() {
    return (
        <>
                <Row className={DashStyle.rowChartlg}>
                    <Col lg={7} className={DashStyle.colChartlg}>
                        <ChartLg />
                    </Col>
                    <Col lg={5} className={DashStyle.colChartlg}>
                        <ChartLg />
                    </Col>
                </Row>
        </>
    )
}

export default BigCharts ;
