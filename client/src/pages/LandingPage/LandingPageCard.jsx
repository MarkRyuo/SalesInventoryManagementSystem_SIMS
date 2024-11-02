/* eslint-disable react/prop-types */
import { Card } from "react-bootstrap"

function LandingPageCard({card}) {

    return (
        <>
            {card.map((cards) => (
                <div key={cards.cardId} style={{ width: '100%', height: '100%', padding: 50, background: 'rgb(6, 249, 119, 15%)', borderRadius: 15}}>
                    <span className='text-center'>{cards.icon}</span>
                    <Card.Body>
                        <Card.Title>{cards.cardTitle}</Card.Title>
                        <Card.Text>{cards.cardText}</Card.Text>
                    </Card.Body>
                </div> 
            ))}
        </>
    )
}

export default LandingPageCard
