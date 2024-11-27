import { Container} from "react-bootstrap"
import NavBars from "./NavBars"
import LandingPageScss from './LandingPage.module.scss';
import HeroCard from './LandingPageCards/HeroCard';


function LandingPage() {

    return (
        <Container fluid className="m-0 p-0" id="home">
            <NavBars />
            <Container fluid className={LandingPageScss.MainContainer}>
                <div>
                    <HeroCard />
                </div>
            </Container>
        </Container>
    )
}

export default LandingPage; 
