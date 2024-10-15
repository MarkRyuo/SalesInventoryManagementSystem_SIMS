import { Form, FloatingLabel, Button, Container } from "react-bootstrap"
import { FaLock } from "react-icons/fa";

function EnableRecoveryMode() {
    return (
        <Container fluid='lg'>

        </Container>
        <div className="Container-" style={{ border: "1px solid", borderRadius: "15px", padding: "20px" }}>
            <div>
                <span><FaLock  size={20}/></span>
                <p className="fs-4">Enable Recovery Mode</p>
                <p>Text Here</p>
            </div>

            <div>
                {/* First Question */}
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

                {/* 2nd Question */}
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

                <Button variant="primary">Verify Answers</Button>
            </div>
        </div>
    )
}

export default EnableRecoveryMode;
