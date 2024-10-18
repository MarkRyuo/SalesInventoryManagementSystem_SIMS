/* eslint-disable react/prop-types */
import {Button, Container, Navbar} from 'react-bootstrap' ;
import { Link } from 'react-router-dom';
function StaffNavBar({backBtn}) {

    return (
        <>
            <Navbar 
                className="bg-body-tertiary" 
                style={{boxShadow: "1px 1px 4px "}}>
                <Container>
                    <Navbar.Brand>
                        {backBtn.map((Backbtn) => (
                            <Button 
                                as={Link} 
                                key={Backbtn.id} 
                                to={Backbtn.path}
                                variant='light'
                            >
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
