import { NavDashboard } from "../components/NavBar/NavDashboard"
import { Container } from "react-bootstrap"

export const MainLayout = (children) => {

    return (
        <Container fluid>
            
            <div className="mainContainer">
                <NavDashboard />
                <div className="mainContent">
                    {children}
                </div>
            </div>

        </Container>
    )
}