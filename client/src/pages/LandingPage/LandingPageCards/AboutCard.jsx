import AboutCardscss from './LandingPageCards.module.scss';

function AboutCard() {
    return (
        <div className={AboutCardscss.parentAboutus}> {/* Parent */}
            <h1>About Us</h1>
            <p>Lorem ipsum dolor sit amet consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua</p>

            <h2>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt</h2>

            <div className={AboutCardscss.aboutCards}>
                <div className={AboutCardscss.card}>
                    <div>
                        <img src="https://i.pinimg.com/736x/1f/50/92/1f50928b00d6291a8969a3651908ffd2.jpg" />
                    </div>
                    <div>
                        <h5>Card Title</h5>
                        <p>
                            Some quick example text to build on the card title and make up the
                            bulk of the cards content.
                        </p>
                    </div>
                </div>

                <div className={AboutCardscss.card}>
                    <div>
                        <img src="https://i.pinimg.com/736x/70/e5/6b/70e56be2517516b6fe4add9b3b08a502.jpg" />
                    </div>
                    <div>
                        <h5>Card Title</h5>
                        <p>
                            Some quick example text to build on the card title and make up the
                            bulk of the cards content.
                        </p>
                    </div>
                </div>

                <div className={AboutCardscss.card}>
                    <div>
                        <img src="https://i.pinimg.com/736x/ef/d3/05/efd305767de5abb1312622c8b2046397.jpg" />
                    </div>
                    <div>
                        <h5>Card Title</h5>
                        <p>
                            Some quick example text to build on the card title and make up the
                            bulk of the cards content.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default AboutCard;
