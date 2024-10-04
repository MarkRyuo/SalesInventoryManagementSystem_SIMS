import { Form, Button, ButtonGroup, Dropdown  } from 'react-bootstrap';
import Accountcss from './AccountComp.module.css' ;

const AccountComp = () => {

    return ( 
        <div className="contentAccount" style={{border: "1px solid", width: "500px", height: "100%", padding: "20px"}}>
            <p className='fs-3'>New Staff</p>
            <p className='fs-5'>Details</p>

            <Form.Control  type="text" placeholder="FullName" className='mb-2'/>
            <Form.Control  type="text" placeholder="Username" className='mb-2'/>
            <Form.Control  type="password" placeholder="Password" className='mb-2'/>
            <Dropdown as={ButtonGroup}>
                <Button variant="success">Gender</Button>

                <Dropdown.Toggle split variant="success" id="dropdown-split-basic" />

                <Dropdown.Menu>
                    <Dropdown.Item href="#">Male</Dropdown.Item>
                    <Dropdown.Item href="#">Female</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
            <Form.Control  type="text" placeholder="---" className='my-2' readOnly/>

            <Button type='button' variant='primary'>Create</Button>


        </div>
    );
}

export default AccountComp;