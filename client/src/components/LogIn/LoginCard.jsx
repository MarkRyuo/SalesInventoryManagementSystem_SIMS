import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { Button, Form } from 'react-bootstrap';




export const LoginCard = () => {

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

            <Button variant="primary" className={LoginStyle.btnLogin} onClick={() => handleLogin()}
                size='lg'>Login</Button>
        </>
    )
}