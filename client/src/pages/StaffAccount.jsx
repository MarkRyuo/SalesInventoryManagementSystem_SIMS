import { MainLayout } from '../layout/MainLayout' ;
import { MdAccountBox } from "react-icons/md";

import ProfileComp from '../components/Account/ProfileComp';
import { Button } from 'react-bootstrap';

//* Accounts Page

export const AccountPage = () => {

    return (
        <MainLayout>

            <p className='fs-3'><span><MdAccountBox /></span> Accounts</p>

            <div className='contentAccount' style={{ border: "1px solid #e6e6e6", height: "700px", padding: 50, boxShadow: "5px 8px 8px #e6e6e6", background: " #ffffff", borderRadius: "15px" }}>
                <p className='fs-4'>Staff Details</p>
                <p style={{ borderBottom: "1px solid gray", padding: "20px 10px" }}>Personal Information</p>
                <ProfileComp />

                <Button variant='primary' className='ms-2'>Add</Button>
            </div>

        </MainLayout>
    )
}

export default AccountPage ;