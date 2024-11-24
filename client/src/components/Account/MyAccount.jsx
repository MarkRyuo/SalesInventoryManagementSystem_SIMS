import Sidebar from './SideBar'; // Import Sidebar component

const MyAccount = () => {
    return (
        <div style={{ display: 'flex' }}>
            <Sidebar />
            <div style={{ marginLeft: '250px', padding: '20px' }}>
                <h2>My Account Settings</h2>
                <p>Here you can manage your account details.</p>
            </div>
        </div>
    );
};

export default MyAccount;
