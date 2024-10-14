import { useState } from "react";
import {Button, Container, Navbar} from 'react-bootstrap' ;
import { IoMdArrowBack } from "react-icons/io";

function StaffNavBar() {

    const [backBtn] = useState([
        {
            btnIcon: <IoMdArrowBack />,
            path: "#",
            id: 1
        }
    ])

    return (
        <>
            <Navbar className="bg-body-tertiary">
                <Container>
                    <Navbar.Brand>
                        {backBtn.map((Backbtn) => (
                            <Button key={Backbtn.id}>
                                {Backbtn.btnIcon}
                            </Button>
                        ))}
                    </Navbar.Brand>
                </Container>
            </Navbar>
        </>
    )
}

export default StaffNavBar;
