import {Container, Row} from 'react-bootstrap' ;
import { MainLayout } from '../layout/MainLayout';
import { Charts } from '../components/Dashboard/Charts';
import BigCharts from '../components/Dashboard/BigCharts';
import { RxDashboard } from "react-icons/rx";

export const DashboardPage = () => {


    return (
        
        <MainLayout>
            <Container>
                {/* Dashboard Components */}
                <p className='fs-3 text-center d-inline'>
                <span style={{marginRight: "8px"}}><RxDashboard /></span>
                Dashboard
                </p>

                <Container>
                    <Charts /> 
                    <BigCharts />
                </Container>
            </Container>
        </MainLayout>


    )
}

export default DashboardPage ;