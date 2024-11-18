import { Container, Button} from "react-bootstrap"
import NavBars from "./NavBars"
import LandingPagecss from './LandingPage.module.scss'
import { CiGlobe } from "react-icons/ci";
import AboutCard from "./LandingPageCards/AboutCard";

function LandingPage() {

    return (
        <Container fluid className="m-0 p-0">
            <NavBars />
            <Container fluid className="m-0 p-0">
                <main className={LandingPagecss.main}>
                    <div className={LandingPagecss.heroContainer} id="home">
                        <div className={LandingPagecss.heroSection}> {/* Main Component */}
                            <div className={LandingPagecss.heroText}> {/* Child */}
                                <p>Power Your Life with <span>REYES ELECTRONICS</span></p>
                                <p className="mb-3">Elevate Your Experience with Top-Tier Electronic Products.</p>
                                <Button
                                    variant=''
                                    href="#features"
                                    id="btn"
                                    className={LandingPagecss.Btn}>
                                    <span><CiGlobe /></span> Explore
                                </Button>
                            </div>
                            <div className={LandingPagecss.heroImage}>
                                <img src="/E-commerce.png" />
                            </div>
                        </div>

                        <div>
                            <img src="https://www.fireflyelectric.com/wp-content/uploads/2021/05/FELCO-logo-2021-cropped-1.png"/>
                            <img src="/Mosca.png" />
                        </div>
                    </div>
                    <div className={LandingPagecss.AboutCard}> {/* Main Container */}
                        <AboutCard />
                    </div>
                </main>
            </Container>
        </Container>
    )
}

export default LandingPage
