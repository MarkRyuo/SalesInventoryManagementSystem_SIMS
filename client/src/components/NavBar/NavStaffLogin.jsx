import { BsBox } from "react-icons/bs";
import { Row, Col, Container, Navbar} from 'react-bootstrap';
import Navbars from '../NavBar/Navbar.module.css';


function NavStaffLogin() {
    return (
        <div>   
            <Container fluid className={Navbars.navLogin}> {/* fix sm-Screen 412px */}
                <Navbar>
                    <Container>
                        <Row>
                            <Col> <BsBox size={40} /> </Col>
                            <Col style={{ paddingTop: 4 }}>
                                <Navbar.Brand className="">Staff Portal</Navbar.Brand>
                            </Col>
                        </Row>
                    </Container>
                </Navbar>
            </Container>
        </div>
    )
}

export default NavStaffLogin ;
