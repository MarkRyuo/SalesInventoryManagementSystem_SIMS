/* eslint-disable react/prop-types */

import { Container } from "react-bootstrap"
import NavbarStaffDashboard from "../components/NavBar/NavbarStaffDashboard"
import MainStaffLayoutScss from './MainLayout.module.scss' ;


function MainStaffLayout({children}) {
    return (
        <Container fluid style={{ margin: "0px", padding: "0px" }} className={MainStaffLayoutScss.mainLayoutStaff}>

            <div className="Staff-container" style={{ height: '100vh' }}>
                <NavbarStaffDashboard />
                <Container fluid='lg' className="p-0 mt-5"> {/**Content */}
                    {children}
                </Container>
            </div>

        </Container>
    )
}

export default MainStaffLayout
