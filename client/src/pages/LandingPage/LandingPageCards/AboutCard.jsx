import {Card, Col, Row} from 'react-bootstrap';

function AboutCard() {
    return (
        <div> {/* Main Container */}
            <div> {/* Parent */}
                <h1>About Us</h1>
                <p>Lorem ipsum dolor sit amet consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua</p>

                <div>
                    <h2>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt</h2>
                </div>

                <div>
                    <Row xs={1} md={2} className="g-4">
                        {Array.from({ length: 4 }).map((_, idx) => (
                            <Col key={idx}>
                                <Card>
                                    <Card.Img variant="top" src="holder.js/100px160" />
                                    <Card.Body>
                                        <Card.Title>Card title</Card.Title>
                                        <Card.Text>
                                            This is a longer card with supporting text below as a natural
                                            lead-in to additional content. This content is a little bit
                                            longer.
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div>
            </div>
        </div>
    )
}

export default AboutCard ;
