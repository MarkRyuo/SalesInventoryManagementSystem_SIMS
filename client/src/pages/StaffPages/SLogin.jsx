import { Row, Col, Container } from 'react-bootstrap';
import { RiBox3Fill } from "react-icons/ri";
// import { FcGoogle } from "react-icons/fc";
import LoginStyle from '../Css/Login.module.css'
import SLoginCard from '../../components/LogIn/SLoginCard';
import NavStaffLogin from '../../components/NavBar/NavStaffLogin';

export const SLogin = () => {


    return (
        <>
            <Container fluid className='mb-5 p-0'> <NavStaffLogin /> </Container> {/** 100% width */}

            <Container fluid className={LoginStyle.containerSpace}></Container> {/* Space */}

            <Container fluid='lg' className='d-flex justify-content-center text-center'>
                <Row className={LoginStyle.containerRow}> {/* fix sm-screen 412 px */}
                    <Col lg={12}> <RiBox3Fill size={80} /> </Col>
                    <Col lg={12}> <p className='lead fs-4 my-3'>Staff Management Portal</p></Col>
                    <Col lg={12}> <SLoginCard /> </Col>
                </Row>

            </Container>

        </>
    )
}

export default SLogin ;