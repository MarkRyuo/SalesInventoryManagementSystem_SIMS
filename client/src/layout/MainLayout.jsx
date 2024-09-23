/* eslint-disable react/prop-types */
import { NavDashboard } from "../components/NavBar/NavDashboard"
import { Container } from "react-bootstrap"

export const MainLayout = ({children}) => {

    return (
        <Container fluid>
            
            <div className="mainContainer">
                <NavDashboard />
                <Container fluid='lg' className="mainContent">
                    {children}
                </Container>
            </div>

        </Container>
    )
}