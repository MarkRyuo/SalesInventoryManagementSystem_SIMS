import { Button, Container, Modal } from "react-bootstrap";
import { useState, useEffect } from "react";
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

    // State to control the modal visibility
    const [showModal, setShowModal] = useState(false);

    // Show the modal when the component mounts
    useEffect(() => {
        setShowModal(true);
    }, []);

    // Function to handle closing the modal
    const handleClose = () => setShowModal(false);

    return (
        <Container fluid className="p-0">
            <StaffNavBar backBtn={backBtn.filter(Backbtn => Backbtn.id === 1)} />
            <Container
                fluid="md"
                className="mt-4"
                style={{
                    width: "100%",
                    height: "auto",
                    padding: 0,
                    display: "flex",
                    justifyContent: "center",
                    marginTop: 100,
                }}
            >
                <div
                    style={{
                        height: "600px",
                        width: "auto",
                        padding: 20,
                        textAlign: "center",
                    }}
                >
                    <div
                        style={{
                            width: "auto",
                            textAlign: "center",
                            padding: 30,
                            boxShadow: "2px 2px 5px #E1E4E4",
                            borderRadius: 20,
                        }}
                    >
                        <MdQrCodeScanner size={300} style={{ color: "#688DCE", width: 300 }} />
                    </div>
                    <Button
                        as={Link}
                        to={"/NewAssetsScanner"}
                        size="lg"
                        className="my-5"
                        style={{ width: "100%" }}
                    >
                        Scan
                    </Button>
                </div>
            </Container>

            {/* Modal for the welcome message */}
            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Welcome</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Scan new products to add them to your inventory. Click the Scan button below to start scanning using the QR code scanner.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleClose}>
                        Got it!
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default AddNewAssets;
