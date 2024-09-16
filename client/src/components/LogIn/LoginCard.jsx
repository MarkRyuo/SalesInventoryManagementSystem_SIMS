import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';


export const LoginCard = () => {

    return (

        <>
            <FloatingLabel controlId="floatingInput" label="Username" className="mb-4">
                <Form.Control type="email" placeholder="name@example.com" />
            </FloatingLabel>
            
            <FloatingLabel controlId="floatingPassword" label="Password">
                <Form.Control type="password" placeholder="Password" />
            </FloatingLabel>
        </>
    )
}