import { Form, FloatingLabel } from "react-bootstrap"
import { FaBoxOpen } from "react-icons/fa6";

function ForgotPassword1() {
    return (
        <div className="Container-" style={{border: "1px solid"}}>
            <div>
                <span><FaBoxOpen size={20}/></span>
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
