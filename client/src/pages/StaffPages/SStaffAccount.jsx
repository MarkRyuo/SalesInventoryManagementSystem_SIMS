import StaffAccountComp from "../../components/StaffPortal/StaffAccount/StaffAccountComp";
import MainStaffLayout from "../../layout/MainStaffLayout";


function SStaffAccount() {
    return (
        <MainStaffLayout>
            <p className='fs-3'><span><MdAccountBox /></span> Accounts</p>

            <div className='contentAccount' style={{ border: "1px solid #e6e6e6", height: "700px", padding: 50, boxShadow: "5px 8px 8px #e6e6e6", background: " #ffffff", borderRadius: "15px" }}>
                <p className='fs-4'>Staff Details</p>
                <p style={{ borderBottom: "1px solid gray", padding: "20px 10px" }}>Personal Information</p>
                <StaffAccountComp />

            </div>
        </MainStaffLayout>
    )
}

export default SStaffAccount ;
