import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';

const AccountComp = () => {

    return ( 
        <div className="contentAccount">
            <p>New Staff</p>
            <p>Details</p>

            <Form.Control size="lg" type="text" placeholder="FullName" />
            <Form.Control size="lg" type="text" placeholder="Username" />
            <Form.Control size="lg" type="password" placeholder="Password" />
            <Form.Control size="lg" type="text" placeholder="FullName" />

            <Dropdown as={ButtonGroup}>
                <Button variant="success">Split Button</Button>

                <Dropdown.Toggle split variant="success" id="dropdown-split-basic" />

                <Dropdown.Menu>
                    <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                    <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                    <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>

        </div>
    );
}

export default AccountComp;