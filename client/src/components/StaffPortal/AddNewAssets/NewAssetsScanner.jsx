import { Container } from "react-bootstrap"
import { useState } from "react"
import { IoMdArrowBack } from "react-icons/io";
import StaffNavBar from "../StaffNavbar/StaffNavBar";

//? 1st See
function NewAssetsScanner() {

    const [backBtn] = useState([
        {
            btnIcon: <IoMdArrowBack />,
            path: "/SDashboard",
            id: 1
        }
    ])
    return (
        <Container Fluid>
            <StaffNavBar backBtn={backBtn.filter(Backbtn => Backbtn.id === 1)}/>
            <Container fluid='lg'>
                <h2>New Assets Scanner</h2>
            </Container>
        </Container>
    )
}

export default NewAssetsScanner
