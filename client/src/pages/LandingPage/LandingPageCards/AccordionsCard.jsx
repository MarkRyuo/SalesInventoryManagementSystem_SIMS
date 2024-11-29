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
            <Accordion className={Accordionstyles.containerAc}>
                {accordionItems.map((body, idx) => (
                    <Accordion.Item key={idx} eventKey={idx.toString()} className={Accordionstyles.ItemAc}>
                        <Accordion.Header>Accordion Item #{idx + 1}</Accordion.Header>
                        <Accordion.Body>{body}</Accordion.Body>
                    </Accordion.Item>
                ))}
            </Accordion>

            <Carousel fade className={Accordionstyles.CarouselContainer}>
                {carouselItems.map((item, idx) => (
                    <Carousel.Item key={idx}>
                        <img src={item.src} alt='' />
                        <Carousel.Caption>
                            <h3>{item.label}</h3>
                            <p>{item.text}</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                ))}
            </Carousel>
        </div>
    );
}

export default AccordionsCard;
