import Dropdown from 'react-bootstrap/Dropdown';
import { Link } from 'react-router-dom';

const AccountDropdown = () => {
    return (
        <>
            <Dropdown>
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                    Account
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    <Dropdown.Item as={Link} to={"#"}>My Profile</Dropdown.Item>
                    <Dropdown.Item href="#/action-2">Staff Account</Dropdown.Item>
                    <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </>
    );
}

export default AccountDropdown;