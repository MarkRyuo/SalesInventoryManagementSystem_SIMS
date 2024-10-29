import { Container } from "react-bootstrap"
import StaffNavBar from "../StaffNavbar/StaffNavBar";
import { useState } from "react";
import { IoMdArrowBack } from "react-icons/io";


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
            <Container fluid='lg'>
                <Row>
                    <Col>
                        
                    </Col>
                </Row>
            </Container>
            
        </Container>
    )
}

export default PosScanner
