import {Container} from 'react-bootstrap' ;
import { MainLayout } from '../layout/MainLayout';
import { RxDashboard } from "react-icons/rx";

export const DashboardPage = () => {


    return (
        
        <MainLayout>

                {/* Dashboard Components */}
                <p className='fs-3 text-center d-inline'>
                <span style={{marginRight: "8px"}}><RxDashboard /></span>
                Dashboard
                </p>
                

        </MainLayout>


    )
}

export default DashboardPage ;