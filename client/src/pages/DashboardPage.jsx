import {Container, Row, Col} from 'react-bootstrap' ;
import { MainLayout } from '../layout/MainLayout';
import { Charts } from '../components/Dashboard/Charts';
import BigCharts from '../components/Dashboard/BigCharts';

export const DashboardPage = () => {

    const ChartData = {
        ChartName1 : "Chart1", 

        ChartName2 : "Chart2",

        ChartName3: "Chart3",

        ChartName4: "Chart4"
    }

    return (
        
        <MainLayout>
            <Container>
                {/* Dashboard Components */}
                <h1>Dashboard</h1>
                <div>
                    <Row>
                        <Col>
                            <Charts ChartNumber={ChartData.ChartName1} />
                        </Col>
                        <Col>
                            <Charts ChartNumber={ChartData.ChartName2} />
                        </Col>
                        <Col>

                        </Col>
                    </Row>
                    <Row>
                        <Col lg={8} sm={12}>
                            <BigCharts />
                        </Col>

                        <Col lg={4} sm={12}>
                            <BigCharts />
                        </Col>
                    </Row>
                </div>
            </Container>
        </MainLayout>


    )
}

export default DashboardPage ;