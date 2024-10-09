/* eslint-disable react/prop-types */

import { Container } from "react-bootstrap"


function MainStaffLayout({children}) {
    return (
        <div className="container">
            <Container fluid className="content"> {/**Content */}
                {children}
            </Container>
        </div>
    )
}

export default MainStaffLayout
