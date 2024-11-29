import { Accordion, Carousel } from 'react-bootstrap';
import Accordionstyles from './SCSS/AccordionsCard.module.scss';

function AccordionsCard() {
    const accordionItems = [
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        "Ut enim ad minim veniam.",
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        "Ut enim ad minim veniam, laboris nisi ut aliquip."
    ];

    return (
        <div className={Accordionstyles.MainContent}>

            <div className={Accordionstyles.FAQcontainer}>
                <h1>FAQ</h1>
                <p>Ut enim ad minim veniam, laboris nisi ut aliquip. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut</p>
                <div className={Accordionstyles.Imgs}>
                    <img src='/Img1.jpg' />
                </div>
            </div>


            <Accordion className={Accordionstyles.containerAc} defaultActiveKey={['0']} alwaysOpen>
                {accordionItems.map((body, idx) => (
                    <Accordion.Item key={idx} eventKey={idx.toString()} className={Accordionstyles.ItemAc}>
                        <Accordion.Header>Accordion Item #{idx + 1}</Accordion.Header>
                        <Accordion.Body>{body}</Accordion.Body>
                    </Accordion.Item>
                ))}
            </Accordion>
            

        </div>
    );
}

export default AccordionsCard;
