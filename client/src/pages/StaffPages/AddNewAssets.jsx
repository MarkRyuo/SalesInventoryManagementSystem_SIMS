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
                <div style={{border: "1px solid red", height: "500px", width: "100%", minWidth: "350px"}}>
                    <div style={{width: '400px', textAlign: 'center', padding: 30, boxShadow: '2px 2px 5px #E1E4E4', borderRadius: 20}}>
                        <MdQrCodeScanner size={300} style={{ color: '#688DCE'}} />
                    </div>
                </div>
            </Container>
        </Container>
    )
}

export default AddNewAssets;
