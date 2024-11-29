import Accordion from 'react-bootstrap/Accordion';
import Carousel from 'react-bootstrap/Carousel';
import AccordionsCardScss from './SCSS/AccordionsCard.module.scss';


function AccordionsCard() {
    return (
        <div className={AccordionsCardScss.MainAccordion}>
            <Accordion className={AccordionsCardScss.AccordionsContainer} defaultActiveKey={['0']} alwaysOpen>
                <Accordion.Item eventKey="0" className={AccordionsCardScss.ContainerAc}>
                    <Accordion.Header>Accordion Item #1</Accordion.Header>
                    <Accordion.Body>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                        eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                    <Accordion.Header>Accordion Item #2</Accordion.Header>
                    <Accordion.Body>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                        eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                        minim veniam.
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="2">
                    <Accordion.Header>Accordion Item #3</Accordion.Header>
                    <Accordion.Body>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                        eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                        minim veniam.
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="3">
                    <Accordion.Header>Accordion Item #4</Accordion.Header>
                    <Accordion.Body>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                        eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                        minim veniam.
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>


            <Carousel fade className={AccordionsCardScss.CarouselContainer}>
                <Carousel.Item>
                    <img src='/Img1.jpg' alt='' />
                    <Carousel.Caption>
                        <h3>First slide label</h3>
                        <p>Some Text</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img src='/img3.jpg' alt='' />
                    <Carousel.Caption>
                        <h3>Second slide label</h3>
                        <p>Some Text</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img src='/img4.jpg' alt='' />
                    <Carousel.Caption>
                        <h3>Third slide label</h3>
                        <p>Some Text</p>
                    </Carousel.Caption>
                </Carousel.Item>
            </Carousel>
        </div>
    )
}

export default AccordionsCard;
