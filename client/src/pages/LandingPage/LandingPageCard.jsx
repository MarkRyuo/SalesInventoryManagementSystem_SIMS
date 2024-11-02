import { Card } from "react-bootstrap"

function LandingPageCard({cards}) {

    return (
        <>
            {card.map((cards) => (
                <Card key={cards.cardId} style={{ width: '18rem' }}>
                    <Card.Img variant="top" src="holder.js/100px180" />
                    <Card.Body>
                        <Card.Title>{cards.cardTitle}</Card.Title>
                        <Card.Text>{cards.cardText}</Card.Text>
                    </Card.Body>
                </Card> 
            ))}
        </>
    )
}

export default LandingPageCard
