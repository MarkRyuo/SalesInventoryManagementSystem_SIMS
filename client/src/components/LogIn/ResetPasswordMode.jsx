import { Form, FloatingLabel, Button, Container } from "react-bootstrap"
import { FaUnlock } from "react-icons/fa";

function ResetPasswordMode() {
    return (
        <Container fluid='lg'>
            <div className="Container-" style={{ border: "1px solid", borderRadius: "15px", padding: "20px" }}>
                <div>
                    <span><FaUnlock size={20}/></span>
                    <p className="fs-4">Enable Recovery Mode</p>
                    <p>Text Here</p>
                </div>

                <div>
                    <FloatingLabel
                        controlId="floatingInput"
                        label=""
                        className="mb-3"
                    >
                        <Form.Control type="text" placeholder="" />
                    </FloatingLabel>
                    <FloatingLabel controlId="floatingPassword" label="">
                        <Form.Control type="text" placeholder="" />
                    </FloatingLabel>

                    <Button variant="primary">Reset Password</Button>
                </div>
            </div>
        </Container>
    )
}

export default ResetPasswordMode;
