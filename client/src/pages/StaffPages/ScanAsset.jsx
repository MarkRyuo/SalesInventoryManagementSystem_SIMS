import { Button, Container } from "react-bootstrap";
import { useState } from "react";
import { IoMdArrowBack } from "react-icons/io";
import StaffNavBar from "../../components/StaffPortal/StaffNavbar/StaffNavBar";
import { MdQrCodeScanner } from "react-icons/md";
import { Link } from "react-router-dom";

function ScanAsset() {
    const [backBtn] = useState([
        {
            btnIcon: <IoMdArrowBack size={20} />,
            path: "/SDashboard",
            Title: "Inventory",
            pathTransaction: "/StaffProductPage",
            id: 1
        }
    ]);

    return (
        <Container fluid className="p-0" style={{ height: '100vh', background: " radial-gradient(800px at 0.7% 3.4%, rgb(164, 231, 192) 0%, rgb(245, 255, 244) 80%)" }}>
            <StaffNavBar backBtn={backBtn.filter(Backbtn => Backbtn.id === 1)} />
            <Container fluid="md" className="mt-4 p-0">
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", minWidth: 380 }}>
                    <div
                        style={{
                            width: '100%',
                            maxWidth: "450px",
                            textAlign: "center",
                            padding: "20px 30px",
                            borderRadius: 20,
                            boxShadow: "2px 2px 5px #E1E4E4",
                            marginBottom: 20
                        }}
                    >
                        <p className="fs-4 m-0 fw-semibold" style={{ color: '#616161' }}>Scan QR Code & Barcode</p>
                        <p className="mt-3" style={{ marginTop: 10, fontSize: 15 }}>
                            Scan items to add them to the POS system. Click the Scan button below to start scanning using the QR/Barcode scanner.
                        </p>
                    </div>
                    <div
                        style={{
                            width: "100%",
                            maxWidth: "400px",
                            padding: 20,
                            boxShadow: "2px 2px 5px #E1E4E4",
                            borderRadius: 20,
                            textAlign: "center"
                        }}
                    >
                        <MdQrCodeScanner size={300} style={{ color: "#688DCE" }} />
                        <Button
                            as={Link}
                            to={'/PosScanner'}
                            size="lg"
                            className="my-4"
                            style={{ width: '100%' }}
                        >
                            Scan
                        </Button>
                    </div>
                </div>
            </Container>
        </Container>
    );
}

export default ScanAsset;
