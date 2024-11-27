import AboutCardscss from './SCSS/AboutUs.module.scss';
import { FcAbout } from "react-icons/fc";

function AboutCard() {

    return (
        <div className={AboutCardscss.parentAboutUs}> {/* Parent */}
            <h1>About Us <FcAbout size={20} className='ms-1' /></h1>
            <h5>REYES ELECTRONICS is a leading provider of high-quality electronics</h5>
            <h2>&quot;With years of industry experience, REYES ELECTRONICS has built a reputation for providing high-quality products and services.&quot;</h2>
            
            <div className={AboutCardscss.aboutCards}>
                <div className={AboutCardscss.card}>
                    <div>
                        {/* <img src="/Img1.jpg" /> */}
                    </div>
                    <div>
                        <h5>Reyes Electronics Storefront</h5>
                        <p>
                            The exterior shot of Reyes Electronics with the signage of his store and entrance.  The picture shows a busy retail place full of goods in stock.
                        </p>
                    </div>
                </div>

                <div className={AboutCardscss.card}>
                    <div>
                        {/* <img src="/img4.jpg" /> */}
                    </div>
                    <div>
                        <h5>Electronics section</h5>
                        <p>
                            An interior shot of Reyes Electronics with an aisle or section full of different electronic components.  The shelves are packed full which means good variety in the inventory.
                        </p>
                    </div>
                </div>

                <div className={AboutCardscss.card}>
                    <div>
                        {/* <img src="/img3.jpg" /> */}
                    </div>
                    <div>
                        <h5>Diverse Inventory</h5>
                        <p>
                            This interior shot of Reyes Electronics shows them the range in their products.  The picture indicates that there are several pieces of electronics and components available.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default AboutCard;
