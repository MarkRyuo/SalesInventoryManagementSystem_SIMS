import { Container, Button} from "react-bootstrap"
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
            icon: <MdOutlineInventory size={50} />,
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
                        <h1 className="mb-5" id="features">Features</h1>
                        <div className={LandingPagecss.rowFeature}>
                            <div className={LandingPagecss.colFeature}>
                                <LandingPageCard card={card.filter(cards => cards.cardId === 1)} />
                            </div>
                            <div className={LandingPagecss.colFeature}>
                                <LandingPageCard card={card.filter(cards => cards.cardId === 2)} />
                            </div>
                            <div className={LandingPagecss.colFeature}>
                                <LandingPageCard card={card.filter(cards => cards.cardId === 3)} />
                            </div>
                            <div className={LandingPagecss.colFeature}>
                                <LandingPageCard card={card.filter(cards => cards.cardId === 4)} />
                            </div>
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
