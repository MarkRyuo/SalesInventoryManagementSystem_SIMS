import { Container } from "react-bootstrap"
import { useState } from "react"
import { IoMdArrowBack } from "react-icons/io";

//? 1st See
function NewAssetsScanner() {

    const [backBtn] = useState([
        {
            btnIcon: <IoMdArrowBack />,
            path: "#",
            id: 1
        }
    ])
    return (
        <Container Fluid>
            
            <Container fluid='lg'>
                <h2>New Assets Scanner</h2>

            </Container>
        </Container>
    )
}

export default NewAssetsScanner
