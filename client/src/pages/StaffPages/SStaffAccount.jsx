import StaffAccountComp from "../../components/StaffPortal/StaffAccount/StaffAccountComp";
import MainStaffLayout from "../../layout/MainStaffLayout";
import { MdAccountBox } from "react-icons/md";



function SStaffAccount() {
    return (
        <MainStaffLayout>
            <p className='fs-3'><span><MdAccountBox /></span> Accounts</p>

            <div className='contentAccount' style={{ 
                border: "1px solid #e6e6e6", 
                height: "100vh", 
                padding: 50, 
                boxShadow: "5px 8px 8px #e6e6e6", 
                background: " #ffffff", 
                borderRadius: "50px"                
            }}>
                <p className='fs-4'>My Profile</p>  {/* Can First Name */}
                <p style={{ borderBottom: "1px solid gray", padding: "20px 10px" }}>Personal Information</p>
                <StaffAccountComp />
            </div>
        </MainStaffLayout>
    )
}

export default SStaffAccount ;
