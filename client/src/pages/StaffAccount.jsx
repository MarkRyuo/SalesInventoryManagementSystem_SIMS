import { MainLayout } from '../layout/MainLayout' ;
import { MdAccountBox } from "react-icons/md";

import { Button } from 'react-bootstrap';
import StaffComp from '../components/Account/StaffComp';

//* Accounts Page

export const StaffAccount = () => {

    return (
        <MainLayout>

            <p className='fs-3'><span><MdAccountBox /></span> Accounts</p>

            <div className='contentAccount' style={{ border: "1px solid #e6e6e6", height: "700px", padding: 50, boxShadow: "5px 8px 8px #e6e6e6", background: " #ffffff", borderRadius: "15px" }}>
                <p className='fs-4'>Staff Details</p>
                <p style={{ borderBottom: "1px solid gray", padding: "20px 10px" }}>Personal Information</p>
                <StaffComp />

                <Button variant='primary' className='ms-2'>Add</Button>
            </div>

        </MainLayout>
    )
}

export default StaffAccount ;