import {Container} from 'react-bootstrap' ;
import { NavDashboard } from '../components/NavBar/NavDashboard';

export const DashboardPage = () => {

    return (

        <Container fluid='lg'>
            <NavDashboard />

            <Container>
                {/* Dashboard Components */}
                <h1>Dashboard</h1>
            </Container>

        </Container>
    )
}

export default DashboardPage ;