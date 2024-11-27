import { Button } from "react-bootstrap";
import HeroCardScss from './SCSS/HeroCard.module.scss' ;

function HeroCard() {
    return (
        <div>
            <div className={LandingPagecss.heroContainer}>

                <div className={LandingPagecss.heroSection}> {/* Main Component Hero Section */}

                    <div className={LandingPagecss.heroText}> {/* Child */}
                        <p>Power Your Life with <span>REYES ELECTRONICS</span></p>
                        <p className="mb-3">Elevate Your Experience with Top-Tier Electronic Products.</p>
                        <Button variant='' href="#footer" id="btn" className={LandingPagecss.Btn}>
                            <span><CiGlobe /></span> Explore
                        </Button>
                        <Button variant='' href="#Logins" id="btn" className={LandingPagecss.Btn}>
                            <span><TbLogin2 /></span> Login
                        </Button>
                    </div>

                    <div className={LandingPagecss.heroImage}> {/* Hero Image Logo */}
                        <img src="/Reyes_Electronics_LogoBg.png" />
                    </div>
                </div>
                <div className={LandingPagecss.partners}> {/* Floating Partners */}
                    <img src="https://www.fireflyelectric.com/wp-content/uploads/2021/05/FELCO-logo-2021-cropped-1.png" />
                    <img src="https://www.mosca-elektronik.de/images/template/logo_mosca.png" />
                    <img src="https://www.chinafsl.com/en/templates/specialty/images/logo.png" />
                    <img src="https://www.tapo.com/res/images/home/tapo-logo.png" />
                </div>

            </div>
        </div>
    )
}

export default HeroCard ;
