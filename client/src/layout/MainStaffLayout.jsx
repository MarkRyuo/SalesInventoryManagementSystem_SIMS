/* eslint-disable react/prop-types */

import { Container } from "react-bootstrap"


function MainStaffLayout({children}) {
    return (
        <div className="container">
            <Container   className="content"> {/**Content */}
                {children}
            </Container>
        </div>
    )
}

export default MainStaffLayout
