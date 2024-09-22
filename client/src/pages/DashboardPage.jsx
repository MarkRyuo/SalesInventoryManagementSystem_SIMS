import {Container} from 'react-bootstrap' ;
import { NavDashboard } from '../components/NavBar/NavDashboard';
import { MainLayout } from '../layout/MainLayout';

export const DashboardPage = () => {

    return (
        
        <MainLayout>
            <Container>
                {/* Dashboard Components */}
                <h1>Dashboard</h1>
            </Container>
        </MainLayout>


    )
}

export default DashboardPage ;