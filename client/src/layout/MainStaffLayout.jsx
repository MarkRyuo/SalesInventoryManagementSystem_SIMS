/* eslint-disable react/prop-types */

import { Container } from "react-bootstrap"
import NavbarStaffDashboard from "../components/NavBar/NavbarStaffDashboard"


function MainStaffLayout({children}) {
    return (
        <div className="container">
            <NavbarStaffDashboard />
            <Container fluid className="content"> {/**Content */}
                {children}
            </Container>
        </div>
    )
}

export default MainStaffLayout
