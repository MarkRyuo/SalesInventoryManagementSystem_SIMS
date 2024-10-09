/* eslint-disable react/prop-types */

import { Container } from "react-bootstrap"
import NavbarStaffDashboard from "../components/NavBar/NavbarStaffDashboard"


function MainStaffLayout({children}) {
    return (
        <Container fluid >

            <div className="container">
                <NavbarStaffDashboard />
                <Container fluid className="content"> {/**Content */}
                    {children}
                </Container>
            </div>
        </Container>
    )
}

export default MainStaffLayout
