import { Container} from "react-bootstrap"
import NavBars from "./NavBars"
import LandingPageScss from './LandingPage.module.scss';
import HeroCard from './LandingPageCards/HeroCard';
import AboutCard from './LandingPageCards/AboutCard' ;

function LandingPage() {

    return (
        <Container fluid className="m-0 p-0" id="home">
            <NavBars />
            <Container fluid className={LandingPageScss.MainContainer}>
                <div className={LandingPageScss.heroCard}>
                    <HeroCard />
                </div>

                <div className={LandingPageScss.aboutCard}>
                    <AboutCard />
                </div>
            </Container>
        </Container>
    )
}

export default LandingPage; 
