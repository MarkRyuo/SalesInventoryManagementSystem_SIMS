import { Button } from "react-bootstrap";
import HeroCardScss from './SCSS/HeroCard.module.scss';
import { GoGlobe } from "react-icons/go";

function HeroCard() {
    return (
        <div className={HeroCardScss.heroSection}> {/* Main Component Hero Section */}
            <h1>Power Your Life with
                <span> REYES ELECTRONICS</span>
            </h1>
            <h3>Elevate Your Experience with Top-Tier Electronic Products.</h3>

            <Button variant='' href="#footer" id="btn" className={HeroCardScss.btnExplore}>
                Explore <GoGlobe/>
            </Button>
        </div>

    )
}

export default HeroCard;
