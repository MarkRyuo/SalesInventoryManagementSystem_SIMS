import { Container} from "react-bootstrap"
import NavBars from "../../components/NavBar/NavBars"
import LandingPagecss from './LandingPage.module.scss'

function LandingPage() {
    return (
        <Container fluid className="m-0 p-0">
            <NavBars />
            <Container fluid style={{ border: '1px solid', height: '90vh'}}>
                <main>
                    <div className={LandingPagecss.heroSection}> {/* Main Component */}
                        <div className={LandingPagecss.heroText}> {/* Child */}
                            <p>REYES ELECTRONICS</p>
                            <p className="fs-5">lorem</p>
                        </div>
                        <div className={LandingPagecss.heroImage}>
                            <img src="https://i.pinimg.com/564x/65/fb/13/65fb134226967c5b155c5c0dad18f689.jpg" /> 
                        </div>
                    </div>
                </main>
            </Container>
        </Container>
    )   
}

export default LandingPage