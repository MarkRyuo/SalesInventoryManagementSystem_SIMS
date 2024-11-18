import { Container, Button, Row, Col} from "react-bootstrap"
import NavBars from "./NavBars"
import LandingPageCard from './LandingPageCard'
import LandingPagecss from './LandingPage.module.scss'
import { CiGlobe } from "react-icons/ci";
import { useState } from "react";

import { MdOutlineInventory } from "react-icons/md";
import AboutCard from "./LandingPageCards/AboutCard";

function LandingPage() {

    const [card] = useState([
        { 
            icon: <MdOutlineInventory size={50}/>, 
            cardTitle: 'Inventory Tracking', 
            cardText: 'Keep real-time tabs on stock levels and prevent shortages.', 
            cardId: 1 
        },
        {
            icon: <MdOutlineInventory size={50} />,
            cardTitle: 'Sales Analytics',
            cardText: 'Gain insights into top-performing products and trends.',
            cardId: 2
        },
        {
            icon: <MdOutlineInventory size={50} />,
            cardTitle: 'POS Integration',
            cardText: 'Easily integrate with your POS for seamless sales tracking.',
            cardId: 3
        },
        {
            icon: <MdOutlineInventory size={50} />,
            cardTitle: 'Low Stock Alerts',
            cardText: 'Get instant alerts when stock levels drop below your set threshold.',
            cardId: 4
        },
    ])

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
                    </div>

                    <div className={LandingPagecss.featureContainer}>
                        <h1 className="text-center mb-5" id="features">Features</h1>
                        <Row className={LandingPagecss.rowFeature}>
                            <Col lg={3} className={LandingPagecss.colFeature}>
                                <LandingPageCard card={card.filter(cards => cards.cardId === 1)} />
                            </Col>
                            <Col lg={3}>
                                <LandingPageCard card={card.filter(cards => cards.cardId === 2)} />
                            </Col>
                            <Col lg={3} >
                                <LandingPageCard card={card.filter(cards => cards.cardId === 3)} />
                            </Col>
                            <Col lg={3}>
                                <LandingPageCard card={card.filter(cards => cards.cardId === 4)} />
                            </Col>
                        </Row>
                    </div>

                    <div>
                        <div> {/* Main Container */}
                            <AboutCard />
                        </div>
                    </div>
                </main>
            </Container>
        </Container>
    )   
}

export default LandingPage
