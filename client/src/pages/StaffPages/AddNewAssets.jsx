import { Container } from "react-bootstrap"
import { useState } from "react"
import { IoMdArrowBack } from "react-icons/io";
import StaffNavBar from "../../components/StaffPortal/StaffNavbar/StaffNavBar";
import NewAssetsScanner from "../../components/StaffPortal/AddNewAssets/NewAssetsScanner";
import { MdQrCodeScanner } from "react-icons/md";


function AddNewAssets() {

    const [backBtn] = useState([
        {
            btnIcon: <IoMdArrowBack size={20} />,
            path: "/SDashboard",
            id: 1
        }
    ]) ;

    return (
        <Container fluid className="p-0">
            <StaffNavBar backBtn={backBtn.filter(Backbtn => Backbtn.id === 1)} />
            <Container fluid='lg' className="mt-4" style={{ border: "1px solid", width: "100%", height: "auto" }}>
                <h2>New Assets Scanner</h2> {/*Temporary */}
                <div style={{border: "1px solid red", height: "500px", width: "100%", minWidth: "350px"}}>
                    <div>
                        <MdQrCodeScanner size={300} style={{color: }} />
                    </div>
                </div>
            </Container>
        </Container>
    )
}

export default AddNewAssets;
