/* eslint-disable react/prop-types */
import { Button, Container, Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
function StaffNavBar({ backBtn }) {

    return (
        <Container fluid className='m-0 p-0'>
            <Navbar
                className="bg-body-tertiary m-0"
                style={{
                    boxShadow: "1px 1px 4px #E1E4E4 ",
                }}>
                {backBtn.map((Backbtn) => (
                    <Container key={Backbtn.id}>
                        <Navbar.Brand style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            width: '100%'
                        }}>
                            <Button
                                as={Link}
                                to={Backbtn.path}
                                variant='light'
                            >
                                {Backbtn.btnIcon}
                            </Button>

                            <Button
                                as={Link}
                                to={Backbtn.pathTransaction}
                                variant='light'
                                className='fs-5'
                            >
                                {Backbtn.Title}
                            </Button>
                        </Navbar.Brand>
                    </Container>
                ))}
            </Navbar>
        </Container>
    )
}

export default StaffNavBar;
