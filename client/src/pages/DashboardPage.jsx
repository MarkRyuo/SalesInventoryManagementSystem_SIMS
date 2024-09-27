import {Container, Row, Col} from 'react-bootstrap' ;
import { MainLayout } from '../layout/MainLayout';
import { Charts } from '../components/Dashboard/Charts';
import BigCharts from '../components/Dashboard/BigCharts';

export const DashboardPage = () => {


    return (
        
        <MainLayout>
            <Container>
                {/* Dashboard Components */}
                <h1>Dashboard</h1>
                <Container>
                    <Charts /> 
                    <BigCharts />
                </Container>
            </Container>
        </MainLayout>


    )
}

export default DashboardPage ;