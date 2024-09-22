import {Container} from 'react-bootstrap' ;
import { Product, Reports, Accounts } from './' ; 
import { NavDashboard } from '../components/NavBar/NavDashboard';

export const Dashboard = () => {

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

export default Dashboard ;