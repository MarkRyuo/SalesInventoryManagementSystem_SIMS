/* eslint-disable react/prop-types */
import { NavDashboard } from "../components/NavBar/NavDashboard"
import { Container } from "react-bootstrap"
import AccountLayoutscss from './SCSS/AccountLayout.module.scss'

export const AccountLayout = ({ children }) => {

    return (
        <Container fluid className={AccountLayoutscss.mainLayoutContainer}>
            <NavDashboard />
            <Container fluid='lg' className='p-0'>
                {children}
            </Container>
        </Container>
    )
}