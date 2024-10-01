import Form from 'react-bootstrap/Form';

const AccountComp = () => {

    return ( 
        <div className="contentAccount">
            <p>New Staff</p>
            <p>Details</p>

            <Form.Control size="lg" type="text" placeholder="Fullname" />

        </div>
    );
}

export default AccountComp;