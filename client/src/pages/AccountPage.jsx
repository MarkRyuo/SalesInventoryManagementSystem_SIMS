import { MainLayout } from '../layout/MainLayout' ;
import { MdAccountBox } from "react-icons/md";

//* Accounts Page

export const AccountPage = () => {

    return (
        <MainLayout>
            
            <p className='fs-3'><span><MdAccountBox /></span> Account Page Dashboard</p>
        </MainLayout>
    )
}

export default AccountPage ;