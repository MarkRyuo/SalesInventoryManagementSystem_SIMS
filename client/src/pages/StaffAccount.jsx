import { MainLayout } from '../layout/MainLayout' ;
import { MdAccountBox } from "react-icons/md";
import StaffComp from '../components/Account/StaffComp';

//* Accounts Page

export const StaffAccount = () => {

    return (
        <MainLayout>

            <p className='fs-3'><span><MdAccountBox /></span> Accounts</p>

            <div className='contentAccount' style={{ 
                border: "1px solid #e6e6e6",
                height: "auto", 
                width: "100%", 
                padding: "30px" ,  
                boxShadow: "5px 8px 8px #e6e6e6", 
                background: " #ffffff", 
                borderRadius: "50px" 
            }}>
                <p className='fs-4'>Staff Management</p>
                <p style={{ borderBottom: "1px solid gray", padding: "15px 10px" }}>Personal Information</p>
                <StaffComp />

            </div>

        </MainLayout>
    )
}

export default StaffAccount ;