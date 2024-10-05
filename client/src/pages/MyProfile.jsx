import { MainLayout } from '../layout/MainLayout';
import { MdAccountBox } from "react-icons/md";

//* Accounts Page

export const MyProfile = () => {

    return (
        <MainLayout>

            <p className='fs-3'><span><MdAccountBox /></span> Accounts</p>

            <div className='contentAccount' style={{ border: "1px solid red", height: "700px" }}>
                <p>My Details</p>
                <p style={{borderBottom:"1px solid gray", paddingBottom: "50px" }}>Personal Information</p>
            </div>
        </MainLayout>
    )
}

export default MyProfile;