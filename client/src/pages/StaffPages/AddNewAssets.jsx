import { Button, Container } from "react-bootstrap";
import { useState } from "react";
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
    ]);

    return (
        <Container fluid className="p-0">
            <StaffNavBar backBtn={backBtn.filter(Backbtn => Backbtn.id === 1)} />
            <Container fluid="md" className="mt-4 p-0">
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", minWidth: 380 }}>
                    <div
                        style={{
                            width: '100%',
                            maxWidth: "400px",
                            textAlign: "center",
                            padding: "20px 30px",
                            borderRadius: 20,
                            boxShadow: "2px 2px 5px #E1E4E4",
                            marginBottom: 20
                        }}
                    >
                        <p className="fs-4 m-0" style={{ fontWeight: 600 }}>Scan QR Code & Barcode</p>
                        <p className="m-0" style={{ marginTop: 10 }}>
                            Scan new products to add them to your inventory. Click the Scan button below to start scanning using the QR code scanner.
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
                            to={'/NewAssetsScanner'}
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

export default AddNewAssets;
