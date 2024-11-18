import AboutCardscss from './LandingPageCards.module.scss';
import { FcAbout } from "react-icons/fc";

function AboutCard() {
    return (
        <div className={AboutCardscss.parentAboutus}> {/* Parent */}
            <h1 id='Aboutus' className='mb-4'>About Us <FcAbout size={20} className='ms-1' /></h1>
            <p>REYES ELECTRONICS is a leading provider of high-quality electronics</p>

            <h2>&quot;With years of industry experience, REYES ELECTRONICS has built a reputation for providing high-quality products and services.&quot;</h2>



            <div className={AboutCardscss.aboutCards}>
                <div className={AboutCardscss.card}>
                    <div>
                        <img src="/Img1.jpg" />
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
