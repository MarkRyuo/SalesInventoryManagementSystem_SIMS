import MyProfileComp from '../components/Account/MyProfileComp';
import { MainLayout } from '../layout/MainLayout';
import { MdAccountBox } from "react-icons/md";

//* Accounts Page

export const MyProfile = () => {

    return (
        <MainLayout>

            <p className='fs-3'><span><MdAccountBox /></span> Accounts</p>

            <div className='contentAccount' style={{ border: "1px solid red", height: "700px" }}>
                <MyProfileComp />
            </div>
        </MainLayout>
    )
}

export default MyProfile;