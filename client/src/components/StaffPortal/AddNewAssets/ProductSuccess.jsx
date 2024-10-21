import { Container, Button} from "react-bootstrap";

//* Product Success
function ProductSuccess() {
    return (
        <Container fluid='md'>
            <div>
                <span>{/* Icon Check */}</span>
                <p>Success</p>
            </div>
            <div>
                <Button variant="outline-success">Done</Button>
            </div>
        </Container>
    )
}

export default ProductSuccess ;
