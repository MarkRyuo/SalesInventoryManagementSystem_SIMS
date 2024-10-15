/* eslint-disable react/prop-types */
import {Button, Container, Navbar} from 'react-bootstrap' ;

function StaffNavBar({backBtn}) {

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
