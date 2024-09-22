import {Container} from 'react-bootstrap' ;
import {Routes, Route, Outlet} from 'react-router-dom'
import { Product } from './Product' ; 

export const Dashboard = () => {

    return (

        <Container>
            
            <Routes>
                <Route path=' Product' element={<Product />}/>
            </Routes>
            <Outlet/>

        </Container>
    )
}

export default Dashboard ;