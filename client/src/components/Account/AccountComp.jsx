
import { Form,  } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';

const AccountComp = () => {

    return ( 
        <div className="contentAccount" style={{border: "1px solid", width: "500px", height: "500px"}}>
            <p className='fs-3'>New Staff</p>
            <p className='fs-5'>Details</p>

            <Form.Control  type="text" placeholder="FullName" />
            <Form.Control  type="text" placeholder="Username" />
            <Form.Control  type="password" placeholder="Password" />
            <Dropdown as={ButtonGroup}>
                <Button variant="success">Gender</Button>

                <Dropdown.Toggle split variant="success" id="dropdown-split-basic" />

                <Dropdown.Menu>
                    <Dropdown.Item href="#">Male</Dropdown.Item>
                    <Dropdown.Item href="#">Female</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
            <Form.Control  type="text" placeholder="Gender" />


        </div>
    );
}

export default AccountComp;