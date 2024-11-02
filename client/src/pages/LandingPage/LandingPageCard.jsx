/* eslint-disable react/prop-types */
import { Card } from "react-bootstrap"

function LandingPageCard({card}) {

    return (
        <>
            {card.map((cards) => (
                <Card key={cards.cardId} style={{ width: '100%', height: '100%', padding: 30}}>
                    <spam className='text-center'>{cards.icon}</spam>
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
