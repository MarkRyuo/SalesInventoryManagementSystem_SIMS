import { Button, Form, FloatingLabel } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

//* Child
function SLoginCard() {

    const navigate = useNavigate();
    const handleLogin = () => navigate("/SDashboard")

    return (
        <>
            <Form>
                {/* Username */}
                <FloatingLabel controlId="floatingInput" label="Username" className="mb-4">
                    <Form.Control
                        type="text"
                        placeholder='Username'
                    />
                </FloatingLabel>

                {/* Password */}
                <FloatingLabel controlId="floatingPassword" label="Password">
                    <Form.Control
                        type="password"
                        placeholder="Password"
                    />
                </FloatingLabel>

                {/* Button of Login */}
                <Button
                    variant="primary"
                    style={{ width: "70%", marginTop: "20px" }}
                    onClick={handleLogin}
                    size='lg'>
                    Login
                </Button>
            </Form>
        </>
    )
}

export default SLoginCard ;
