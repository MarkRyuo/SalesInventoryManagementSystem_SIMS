/* eslint-disable react/prop-types */
import { Button, Container, Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom'
import StaffNavBarScss from './StaffNavbar.module.scss' ;
;
function StaffNavBar({ backBtn }) {

    return (
        <Container fluid className='m-0 p-0'>
            <Navbar className={StaffNavBarScss.ContainerNav}>

                {backBtn.map((Backbtn) => (
                    <Container key={Backbtn.id} className={StaffNavBarScss.contentNav}>
                        <Navbar.Brand style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            width: '100%'
                        }}>
                            <Button
                                as={Link}
                                to={Backbtn.path}
                                variant=''
                            >
                                {Backbtn.btnIcon}
                            </Button>

                            <Button
                                as={Link}
                                to={Backbtn.pathTransaction}
                                variant=''
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
