import {Container} from 'react-bootstrap' ;
import { MainLayout } from '../layout/MainLayout';
import { Charts } from '../components/Dashboard/Charts';

export const DashboardPage = () => {

    return (
        
        <MainLayout>
            <Container>
                {/* Dashboard Components */}
                <h1>Dashboard</h1>
                <div>
                    <Charts />
                </div>
            </Container>
        </MainLayout>


    )
}

export default DashboardPage ;