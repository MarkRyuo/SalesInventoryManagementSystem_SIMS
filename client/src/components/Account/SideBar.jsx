import { Nav, Navbar } from 'react-bootstrap';
import { FaUser, FaCogs, FaBell, FaLock, FaRegAddressBook } from 'react-icons/fa'; // You can use FontAwesome icons

const Sidebar = () => {
    return (
        <div style={sidebarStyles}>
            <Navbar variant="dark" className="flex-column" style={navbarStyles}>
                <Nav className="flex-column w-100">
                    <Nav.Item>
                        <Nav.Link href="#account">
                            <FaUser style={iconStyles} />
                            My Account
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link href="#settings">
                            <FaCogs style={iconStyles} />
                            Settings
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link href="#notifications">
                            <FaBell style={iconStyles} />
                            Notifications
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link href="#privacy">
                            <FaLock style={iconStyles} />
                            Privacy & Safety
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link href="#contacts">
                            <FaRegAddressBook style={iconStyles} />
                            Connections
                        </Nav.Link>
                    </Nav.Item>
                </Nav>
            </Navbar>
        </div>
    );
};

const sidebarStyles = {
    height: '100vh',
    width: '250px',
    backgroundColor: '#2f3136', // Dark theme
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
};

const navbarStyles = {
    flex: 1,
    paddingTop: '20px',
};

const iconStyles = {
    marginRight: '10px',
};

export default Sidebar;
