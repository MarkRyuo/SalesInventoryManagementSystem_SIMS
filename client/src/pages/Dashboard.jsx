import {Container} from 'react-bootstrap' ;
import {Routes, Route} from 'react-router-dom'
import { Product, Reports, Accounts } from './' ; 
import { NavDashboard } from '../components/NavBar/NavDashboard';

export const Dashboard = () => {

    return (

        <Container fluid='lg'>
            <NavDashboard/>

            <Routes>
                <Route path=' Product' element={<Product />}/>
                <Route path=' Reports' element={<Reports />}/>
                <Route path=' Accounts' element={<Accounts />}/>
            </Routes>

        </Container>
    )
}

export default Dashboard ;