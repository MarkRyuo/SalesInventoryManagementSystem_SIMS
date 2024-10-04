import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';

const AccountComp = () => {

    return ( 
        <div className="contentAccount" style={{border: "1px solid", width: "500px", height: "500px"}}>
            <p>New Staff</p>
            <p>Details</p>

            <Form.Control  type="text" placeholder="FullName" />
            <Form.Control  type="text" placeholder="Username" />
            <Form.Control  type="password" placeholder="Password" />
            <Form.Control  type="text" placeholder="Gender" />

            <Dropdown as={ButtonGroup}>
                <Button variant="success">Gender</Button>

                <Dropdown.Toggle split variant="success" id="dropdown-split-basic" />

                <Dropdown.Menu>
                    <Dropdown.Item href="#">Male</Dropdown.Item>
                    <Dropdown.Item href="#">Female</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>

        </div>
    );
}

export default AccountComp;