import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';



export const LoginCard = () => {

    const [navigate, setNavigate] = useNavigate()

    return (

        <>
            <FloatingLabel controlId="floatingInput" label="Email/Username" className="mb-4">
                <Form.Control 
                    type="text" 
                    placeholder='Email'
                />
            </FloatingLabel>
            
            <FloatingLabel controlId="floatingPassword" label="Password">
                <Form.Control 
                    type="password" 
                    placeholder="Password" 
                />
            </FloatingLabel>

            <Button variant="primary" style={{width: "70%"}} onClick={handleLogin}
                size='lg'>Login</Button>
        </>
    )
}