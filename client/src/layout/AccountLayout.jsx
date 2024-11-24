/* eslint-disable react/prop-types */
import { NavDashboard } from "../components/NavBar/NavDashboard"
import { Container } from "react-bootstrap"
import AccountLayoutscss from './SCSS/AccountLayout.module.scss'
import Sidebar from "../components/Account/SideBar"

export const AccountLayout = ({ children }) => {

    return (
        <Container fluid className={AccountLayoutscss.AccountLayoutContainer}>
            <NavDashboard />
            <Container fluid='lg' className={AccountLayoutscss.accountContainer}>
                <div>
                    <Sidebar />
                </div>
                <div>
                    {children}
                </div>
            </Container>
        </Container>
    )
}

export default AccountLayout ;