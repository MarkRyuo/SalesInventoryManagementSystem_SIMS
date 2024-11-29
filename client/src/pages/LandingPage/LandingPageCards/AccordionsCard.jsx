import { Accordion, Carousel } from 'react-bootstrap';
import Accordionstyles from './SCSS/AccordionsCard.module.scss';

function AccordionsCard() {
    const accordionItems = [
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        "Ut enim ad minim veniam.",
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        "Ut enim ad minim veniam, laboris nisi ut aliquip."
    ];

    const carouselItems = [
        { src: '/Img1.jpg', label: 'First slide label', text: 'Some Text' },
        { src: '/img3.jpg', label: 'Second slide label', text: 'Some Text' },
        { src: '/img4.jpg', label: 'Third slide label', text: 'Some Text' }
    ];

    return (
        <div className={Accordionstyles.MainContent}>
            <Accordion className={Accordionstyles.containerAc} defaultActiveKey={['0']} alwaysOpen>
                {accordionItems.map((body, idx) => (
                    <Accordion.Item key={idx} eventKey={idx.toString()} className={Accordionstyles.ItemAc}>
                        <Accordion.Header>Accordion Item #{idx + 1}</Accordion.Header>
                        <Accordion.Body>{body}</Accordion.Body>
                    </Accordion.Item>
                ))}
            </Accordion>

            <div></div>
        </div>
    );
}

export default AccordionsCard;
