import { Accordion } from 'react-bootstrap';
import Accordionstyles from './SCSS/AccordionsCard.module.scss';

function AccordionsCard() {
    const accordionItems = [
        {
            header: "Why should I choose Reyes Electronics over other retailers?",
            body: "Reyes Electronics is a trusted leader in the electronics industry, known for its premium quality products, unbeatable prices, and exceptional customer service. We carefully select every product to ensure it meets the highest standards, offering you the best value for your investment."
        },
        {
            header: "What makes Reyes Electronics the best choice for my tech needs?",
            body: "At Reyes Electronics, we pride ourselves on staying ahead of the curve with the latest tech innovations. Our knowledgeable team offers personalized guidance, ensuring that every product you choose perfectly matches your needs, from cutting-edge gadgets to reliable home electronics."
        },
        {
            header: "Why are Reyes Electronics stores the best places to shop?",
            body: "Reyes Electronics' stores are more than just places to shop—they are experiences. Our stores are designed to showcase the newest technologies and offer hands-on demonstrations, so you can test out products and make informed decisions. We go the extra mile to provide an exceptional shopping experience with expert advice and tailored recommendations."
        },
        {
            header: "What can I expect from Reyes Electronics' return policy?",
            body: "We stand by the quality of our products, which is why we offer a generous 30-day return policy on most items. At Reyes Electronics, customer satisfaction is our top priority, and we make the return process as simple and hassle-free as possible."
        }
    ];

    return (
        <div className={Accordionstyles.MainContent}>

            <div className={Accordionstyles.FAQcontainer}>
                <h1>FAQ</h1>
                <p>At Reyes Electronics, we take pride in offering unmatched quality, expert advice, and a superior shopping experience. Learn more about why we are the first choice for all your electronic needs.</p>
                <div className={Accordionstyles.Imgs}>
                    <img src='/Img1.jpg' alt="FAQ image" />
                </div>
            </div>

            <div className={Accordionstyles.AccoMain}>
                <Accordion className={Accordionstyles.containerAc} defaultActiveKey={['0']} alwaysOpen>
                    {accordionItems.map((item, idx) => (
                        <Accordion.Item key={idx} eventKey={idx.toString()} className={Accordionstyles.ItemAc}>
                            <Accordion.Header>{item.header}</Accordion.Header>
                            <Accordion.Body>{item.body}</Accordion.Body>
                        </Accordion.Item>
                    ))}
                </Accordion>
            </div>

        </div>
    );
}

export default AccordionsCard;
