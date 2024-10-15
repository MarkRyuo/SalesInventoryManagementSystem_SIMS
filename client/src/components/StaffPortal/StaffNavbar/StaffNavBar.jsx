/* eslint-disable react/prop-types */
import {Button, Container, Navbar} from 'react-bootstrap' ;
import { Link } from 'react-router-dom';
function StaffNavBar({backBtn}) {

    return (
        <>
            <Navbar className="bg-body-tertiary" style={{border: "1px solid red"}}>
                <Container>
                    <Navbar.Brand>
                        {backBtn.map((Backbtn) => (
                            <Button 
                                as={Link} 
                                key={Backbtn.id} 
                                to={Backbtn.path}
                                
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
