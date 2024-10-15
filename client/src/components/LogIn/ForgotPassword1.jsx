import { Form, FloatingLabel } from "react-bootstrap"

function ForgotPassword1() {
    return (
        <div className="Container-" style={{border: "1px solid"}}>
            <div>
                <span>{/*Icon */}</span>
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
            </div>
        </div>
    )
}

export default ForgotPassword1 ;
