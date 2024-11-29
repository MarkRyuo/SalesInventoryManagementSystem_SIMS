import Accordion from 'react-bootstrap/Accordion';
import Carousel from 'react-bootstrap/Carousel';
import AccordionsCardScss from './SCSS/AccordionsCard.module.scss' ;


function AccordionsCard() {
    return (
        <div className={AccordionsCardScss.MainAccordion}>
            <div className=''>
                <Accordion>
                    <Accordion.Item eventKey="0">
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
                </Accordion>
            </div>

            <div>
                <Carousel fade>
                    <Carousel.Item>
                        <img src='/Img1.jpg' alt=''/>
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
        </div>
    )
}

export default AccordionsCard;
