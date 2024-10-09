/* eslint-disable react/prop-types */

import { Container } from "react-bootstrap"
import NavbarStaffDashboard from "../components/NavBar/NavbarStaffDashboard"


function MainStaffLayout({children}) {
    return (
        <Container fluid style={{ margin: "0px", padding: "0px" }}>

            <div className="Staffcontainer">
                <NavbarStaffDashboard />
                <Container fluid='lg' className="content"> {/**Content */}
                    {children}
                </Container>
            </div>

        </Container>
    )
}

export default MainStaffLayout
