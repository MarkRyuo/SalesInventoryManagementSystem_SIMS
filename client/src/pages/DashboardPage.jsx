import {Container, Row, Col} from 'react-bootstrap' ;
import { MainLayout } from '../layout/MainLayout';
import { Charts } from '../components/Dashboard/Charts';
import BigCharts from '../components/Dashboard/BigCharts';

export const DashboardPage = () => {

    const ChartData = {
        Chart1 : {
            chartName : "Chart 1"
        }
    }

    return (
        
        <MainLayout>
            <Container>
                {/* Dashboard Components */}
                <h1>Dashboard</h1>
                <div>
                    <Charts ChartName={...ChartData.chartName}/>
                    <Row>
                        <Col lg={8} sm={12}>
                            <BigCharts />
                        </Col>

                        <Col lg={4} sm={8}>
                            <BigCharts />
                        </Col>
                    </Row>
                </div>
            </Container>
        </MainLayout>


    )
}

export default DashboardPage ;