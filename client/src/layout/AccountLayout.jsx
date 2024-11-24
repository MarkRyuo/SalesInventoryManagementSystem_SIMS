/* eslint-disable react/prop-types */
import { NavDashboard } from "../components/NavBar/NavDashboard"
import { Container } from "react-bootstrap"
import AccountLayoutscss from './SCSS/AccountLayout.module.scss'
import Sidebar from "../components/Account/SideBar"

export const AccountLayout = ({ children }) => {

    return (
        <Container fluid className={AccountLayoutscss.mainLayoutContainer}>
            <NavDashboard />
            <Container fluid='lg' className='p-0'>
                <Sidebar />
                {children}
            </Container>
        </Container>
    )
}