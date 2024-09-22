import {Container} from 'react-bootstrap' ;
import {Routes, Route, Outlet} from 'react-router-dom'
import { Product, Reports, Accounts } from 'pages' ; 
import { NavDashboard } from '../components/NavBar/NavDashboard';

export const Dashboard = () => {

    return (

        <Container>
            <NavDashboard/>
            <Routes>
                <Route path=' Product' element={<Product />}/>
                <Route path=' Reports' element={<Reports />}/>
                <Route path=' Accounts' element={<Accounts />}/>
            </Routes>
            <Outlet/>

        </Container>
    )
}

export default Dashboard ;