import Chart4 from './Chartcomp/Chart4';
import DashStyle from './Dashboard.module.css' ;

import { Container, Row, Col } from 'react-bootstrap';




function BigCharts() {
    return (
        <Container>
            <Row>
                <Col>
                    <Chart4 />
                </Col>
                <Col>

                </Col>
            </Row>
        </Container>
    )
}

export default BigCharts
