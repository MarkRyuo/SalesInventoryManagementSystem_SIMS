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
                    <Dropdown.Item as={Link} to={"#"}>Staff Account</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </>
    );
}

export default AccountDropdown;