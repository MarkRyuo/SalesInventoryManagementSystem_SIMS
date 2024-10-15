import { Form, FloatingLabel, Button, Container } from "react-bootstrap"
import { GoShieldLock } from "react-icons/go";

function ForgotPasswordMode() {
    return (
        <Container fluid='lg' className="Container-" style={{border: "1px solid", borderRadius: "15px", padding: "20px"}}>
            <div>
                <span><GoShieldLock size={20}/></span>
                <p className="fs-4">ForgotPassword</p>
                <p>Text Here</p>
            </div>

            <div>
                <FloatingLabel
                    controlId="floatingInput"
                    label="Username"
                    className="mb-3"
                >
                    <Form.Control type="text" placeholder="name@example.com" />
                        </FloatingLabel>
                        <FloatingLabel controlId="floatingPassword" label="Username">
                    <Form.Control type="text" placeholder="Username" />
                </FloatingLabel>

                <Button variant="primary">Verify Username</Button>
            </div>
        </Container>
    )
}

export default ForgotPasswordMode ;
