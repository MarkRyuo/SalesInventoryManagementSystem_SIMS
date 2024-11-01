import { Container} from "react-bootstrap"
import NavBars from "../components/NavBar/NavBars"

function LandingPage() {
    return (
        <Container fluid className="m-0 p-0">
            <NavBars />
            <Container fluid style={{ border: '1px solid', height: '90vh' }}>
                <main>

                </main>
            </Container>
        </Container>
    )   
}

export default LandingPage
