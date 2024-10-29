import { Container, Row, Col } from "react-bootstrap"
import StaffNavBar from "../StaffNavbar/StaffNavBar";
import { useState } from "react";
import { IoMdArrowBack } from "react-icons/io";
//* Use zxing/library 

//* Scanner Code 
function PosScanner() {

    const [backBtn] = useState([
        {
            btnIcon: <IoMdArrowBack size={20} />,
            path: "/ScanAsset",
            id: 1
        }
    ]);

    return (
        <Container fluid>
            <StaffNavBar backBtn={backBtn.filter(Backbtn => Backbtn.id === 1)} />
            <Container fluid='lg' style={{boxSizing: "border-box"}}>
                <Row style={{boxSizing: "border-box"}}>
                    <Col style={{boxSizing: "border-box"}}>
                        {/* Camera logic Code */}
                        {/* Add Button if scan items is done this is Pos */}
                        {/* if done then direct to ScanAssetsMode or the Current Orders  */}
                    </Col>
                </Row>
            </Container>
            
        </Container>
    )
}

export default PosScanner
