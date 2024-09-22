import {Container} from 'react-bootstrap' ;
import {Routes, Route, Outlet} from 'react-router-dom'

export const Dashboard = () => {

    return (

        <Container>
            
            <Routes>
                <Route/>
            </Routes>
            <Outlet/>

        </Container>
    )
}

export default Dashboard ;