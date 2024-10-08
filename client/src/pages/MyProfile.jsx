import { Button } from 'react-bootstrap';
import ProfileComp from '../components/Account/ProfileComp';
import { MainLayout } from '../layout/MainLayout';
import { MdAccountBox } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import { Form } from 'react-bootstrap';
import MyProfilecss from './Css/MyProfile.module.css' ;

//* Accounts Page

export const MyProfile = () => {

    return (
        <MainLayout>

            <p className='fs-3'><span><MdAccountBox /></span> Accounts</p>

            <div className={MyProfilecss.contentAccount}>
                <p className='fs-4'>My Details</p>
                <p style={{borderBottom:"1px solid gray", padding: "20px 10px" }}>Personal Information</p>

                <ProfileComp />

                <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlInput1"
                    style={{ width: "100%", maxWidth: "500px", paddingLeft: 10 }}>
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="name@example.com" />
                </Form.Group>

                <Button variant="light" size='sm' className='ms-2'>
                    <FcGoogle size={35} className='me-2' />
                    Connect to Google
                </Button>
            
                
            </div>

        </MainLayout>
    )
}

export default MyProfile;