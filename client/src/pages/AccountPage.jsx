import AccountComp from '../components/Account/AccountComp';
import { MainLayout } from '../layout/MainLayout' ;
import { MdAccountBox } from "react-icons/md";

//* Accounts Page

export const AccountPage = () => {

    return (
        <MainLayout>
            
            <p className='fs-3'><span><MdAccountBox /></span> Account</p>

            <div className='contentAccount' style={{border: "1px solid", height: "700px"}}> 

                <AccountComp />

            </div>
        </MainLayout>
    )
}

export default AccountPage ;