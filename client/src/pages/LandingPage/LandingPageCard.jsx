import { Card, Button } from "react-bootstrap"
import { useState } from "react"

function LandingPageCard() {

    const [card] = useState([
        
    ])


    return (
        <>
            <Card style={{ width: '18rem' }}>
                <Card.Img variant="top" src="holder.js/100px180" />
                <Card.Body>
                    <Card.Title>Card Title</Card.Title>
                    <Card.Text>
                        {cardText}
                    </Card.Text>
                    <Button variant="primary">Go somewhere</Button>
                </Card.Body>
            </Card>
        </>
    )
}

export default LandingPageCard
