import Dropdown from 'react-bootstrap/Dropdown';
import { Link } from 'react-router-dom';

import { VscAccount } from "react-icons/vsc";

const AccountDropdown = () => {
    return (
        <>
            <Dropdown>
                <Dropdown.Toggle as="div" style={{ cursor: 'pointer', padding: "10px" }}>
                    <span><VscAccount /></span>Account
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    <Dropdown.Item as={Link} to={"#"}>My Profile</Dropdown.Item>
                    <Dropdown.Item as={Link} to={"/StaffAccount"}>Staff Account</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </>
    );
}

export default AccountDropdown;