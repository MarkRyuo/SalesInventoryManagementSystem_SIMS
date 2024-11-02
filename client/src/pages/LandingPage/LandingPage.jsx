import { Container, Button, Row, Col} from "react-bootstrap"
import NavBars from "../../components/NavBar/NavBars"
import LandingPageCard from './LandingPageCard'
import LandingPagecss from './LandingPage.module.scss'
import { CiGlobe } from "react-icons/ci";
import { useState } from "react";

import { MdOutlineInventory } from "react-icons/md";

function LandingPage() {

    const [card] = useState([
        { 
            icon: <MdOutlineInventory size={50}/>, 
            cardTitle: 'Inventory Tracking', 
            cardText: 'Keep real-time tabs on stock levels and prevent shortages.', 
            cardId: 1 
        }
    ])

    return (
        <Container fluid className="m-0 p-0">
            <NavBars />
            <Container fluid className="m-0 p-0">
                <main>
                    <div className={LandingPagecss.heroContainer}>
                        <div className={LandingPagecss.heroSection}> {/* Main Component */}
                            <div className={LandingPagecss.heroText}> {/* Child */}
                                <p>Power Your Life with <span>REYES ELECTRONICS</span></p>
                                <p className="fs-5">Elevate Your Experience with Top-Tier Electronic Products.</p>
                                <Button variant="outline-primary" size='lg'><span><CiGlobe /></span> Explore</Button>                         
                            </div>
                            <div className={LandingPagecss.heroImage}>
                                <img src="https://i.pinimg.com/564x/65/fb/13/65fb134226967c5b155c5c0dad18f689.jpg" />
                            </div>
                        </div>
                    </div>

                    <Container className={LandingPagecss.featureContainer}>
                        <Row className={LandingPagecss.rowFeature}>
                            <Col lg={3}>
                                <LandingPageCard card={card.filter(cards => cards.cardId === 1)} />
                            </Col>

                            <Col lg={3}>
                                <LandingPageCard card={card.filter(cards => cards.cardId === 1)} />
                            </Col>

                            <Col lg={3}>
                                <LandingPageCard card={card.filter(cards => cards.cardId === 1)} />
                            </Col>

                            <Col lg={3}>
                                <LandingPageCard card={card.filter(cards => cards.cardId === 1)} />
                            </Col>
                        </Row>
                    </Container>

                </main>
            </Container>
        </Container>
    )   
}

export default LandingPage
