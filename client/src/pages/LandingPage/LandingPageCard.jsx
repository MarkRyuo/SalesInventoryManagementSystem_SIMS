/* eslint-disable react/prop-types */
import { Card } from "react-bootstrap"

function LandingPageCard({card}) {

    return (
        <>
            {card.map((cards) => (
                <Card key={cards.cardId} style={{ width: '18rem' }}>
                    <spam>{cards.icon}</spam>
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
