import { NavDashboard } from "../components/NavBar/NavDashboard"
import { Container } from "react-bootstrap"

export const MainLayout = () => {

    return (
        <Container fluid>
            
            <div className="mainContainer">
                <NavDashboard />
            </div>

        </Container>
    )
}