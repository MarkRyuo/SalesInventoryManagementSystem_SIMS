import { Button, Container } from "react-bootstrap"
import { useState } from "react"
import { IoMdArrowBack } from "react-icons/io";
import StaffNavBar from "../../components/StaffPortal/StaffNavbar/StaffNavBar";
import { MdQrCodeScanner } from "react-icons/md";
import { Link } from "react-router-dom";


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
            <Container fluid='lg' className="mt-4" style={{ border: "1px solid", width: "100%", height: "auto", padding: 0, display: 'flex', justifyContent: 'center'}}>
                <div style={{height: "600px", width: "500px", display: "flex", flexDirection: "column", padding: 20, justifyContent: "space-between", flexShrink: 0}}>
                    <p className="fs-5">Text Here</p>
                    <div style={{width: '400px', textAlign: 'center', padding: 30, boxShadow: '2px 2px 5px #E1E4E4', borderRadius: 20}}>
                        <MdQrCodeScanner size={300} style={{ color: '#688DCE'}} />
                    </div>
                    <Button as={Link} to={'/'} size="lg">
                        Scan
                    </Button>
                </div>
            </Container>
        </Container>
    )
}

export default AddNewAssets;
