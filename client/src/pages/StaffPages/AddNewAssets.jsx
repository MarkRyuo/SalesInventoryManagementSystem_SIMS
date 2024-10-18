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
            <Container fluid='md' className="mt-4 p-0">
                <div style={{border: '1px solid', display: "flex", justifyContent: "center", flexDirection: 'column', alignItems: "center", minWidth: 380}}>
                    <div style={{width: '100%', maxWidth: "400px", textAlign: "center", padding: 30, borderRadius: 20, boxShadow: '2px 2px 5px #E1E4E4',}}>
                        <p className="fs-4 m-0">Scan Product</p>
                        <p className="">Scan new products to add them to your inventory. Click the Scan button below to start scanning using the QR code scanner.</p>
                    </div>
                    <div style={{ height: "auto", width: "100%", padding: 20, textAlign: 'center', border: '1px solid red', display: 'flex', justifyContent: 'center' }}>
                        <div style={{width: 400}}>
                            <div style={{textAlign: 'center', padding: 30, boxShadow: '2px 2px 5px #E1E4E4', borderRadius: 20 }}>
                                <MdQrCodeScanner size={300} style={{ color: '#688DCE', width: 300 }} />
                            </div>
                            <Button as={Link} to={'/NewAssetsScanner'} size="lg" className="my-5" style={{ width: '100%' }}>
                                Scan
                            </Button>
                        </div>
                    </div>
                </div>
            </Container>
        </Container>
    )
}

export default AddNewAssets;
