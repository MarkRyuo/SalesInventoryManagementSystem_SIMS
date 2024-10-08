
import ProfileComp from '../components/Account/ProfileComp';
import { MainLayout } from '../layout/MainLayout';
import { MdAccountBox } from "react-icons/md";
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
                
            </div>

        </MainLayout>
    )
}

export default MyProfile;