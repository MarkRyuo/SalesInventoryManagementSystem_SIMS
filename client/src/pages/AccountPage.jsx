import { MainLayout } from '../layout/MainLayout' ;
import { MdAccountBox } from "react-icons/md";

//* Accounts Page

export const AccountPage = () => {

    return (
        <MainLayout>
            
            <p className='fs-3'><span><MdAccountBox /></span> Accoun</p>

            <div className='contentAccount' style={{border: "1px solid", height: "700px"}}> 


            </div>
        </MainLayout>
    )
}

export default AccountPage ;