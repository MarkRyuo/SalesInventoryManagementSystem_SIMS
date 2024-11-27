import { Container} from "react-bootstrap"
import NavBars from "./NavBars"
import LandingPageScss from './LandingPage.module.scss';
import HeroCard from './LandingPageCards/HeroCard';
import AboutCard from './LandingPageCards/AboutCard' ;
import LoginCardPage from './LandingPageCards/LogInCardPage'
import Footer from './LandingPageCards/'

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

                <div className={LandingPageScss.loginCard}>
                    <LoginCardPage />
                </div>

                <div className={LandingPageScss.footerCard}>
                    <Footer />
                </div>
            </Container>
        </Container>
    )
}

export default LandingPage; 
