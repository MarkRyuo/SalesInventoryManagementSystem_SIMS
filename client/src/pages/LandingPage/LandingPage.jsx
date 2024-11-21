import { Container, Button} from "react-bootstrap"
import NavBars from "./NavBars"
import LandingPagecss from './LandingPage.module.scss'
import { CiGlobe } from "react-icons/ci";
import AboutCard from "./LandingPageCards/AboutCard";
import Footer from "./LandingPageCards/Footer";

function LandingPage() {

    return (
        <Container fluid className="m-0 p-0" id="home">
            <NavBars />
            <Container fluid className="m-0 p-0">
                <main className={LandingPagecss.main}>
                    <div className={LandingPagecss.heroContainer}>
                        <div className={LandingPagecss.heroSection}> {/* Main Component */}
                        
                            <div className={LandingPagecss.heroText}> {/* Child */}
                                <p>Power Your Life with <span>REYES ELECTRONICS</span></p>
                                <p className="mb-3">Elevate Your Experience with Top-Tier Electronic Products.</p>

                                <Button variant='' href="#footer" id="btn" className={LandingPagecss.Btn}>
                                    <span><CiGlobe /></span> Explore
                                </Button>
                            </div>
                            <div className={LandingPagecss.heroImage}> {/* Hero Image */}
                                <img src="/Reyes_Electronics_LogoBg.png" />
                            </div>
                        </div>

                        <div className={LandingPagecss.partners}>
                            <img src="https://www.fireflyelectric.com/wp-content/uploads/2021/05/FELCO-logo-2021-cropped-1.png"/>
                            <img src="https://www.mosca-elektronik.de/images/template/logo_mosca.png" />
                            <img src="https://www.chinafsl.com/en/templates/specialty/images/logo.png" />
                            <img src="https://www.tapo.com/res/images/home/tapo-logo.png" />
                        </div>

                    </div>

                    <div className={LandingPagecss.AboutCard} id="Aboutus"> {/* Main Container About Card*/}
                        <AboutCard />
                    </div>

                    <div>
                        {/* Login */}
                    </div>

                    <div id="footer">
                        <Footer />
                    </div>
                </main>
            </Container>
        </Container>
    )
}

export default LandingPage
