import { Button } from "react-bootstrap";
import HeroCardScss from './SCSS/HeroCard.module.scss';

function HeroCard() {
    return (
        <div className={HeroCardScss.heroSection}> {/* Main Component Hero Section */}
            <h1>Power Your Life with 
                <span>REYES ELECTRONICS</span>
            </h1>
            <h3>Elevate Your Experience with Top-Tier Electronic Products.</h3>

            <div className={HeroCardScss.HeroButtons}> {/* Child */}
                <Button variant='' href="#footer" id="btn" className={HeroCardScss.btnExplore}>
                    Explore
                </Button>
                <Button variant='' href="#Logins" id="btn" className={HeroCardScss.btnLogin}>
                    Login
                </Button>
            </div>

        </div>
    )
}

export default HeroCard;