import { Form, Button, Dropdown, InputGroup, DropdownButton  } from 'react-bootstrap';
import Accountcss from './AccountComp.module.css' ;
import { useState } from 'react';
const AccountComp = () => {

    const [gender, setGender] = useState('');

    // Function to handle gender selection
    const handleGenderSelect = (eventKey) => {
        setGender(eventKey); // Updates the gender state with the selected value
    };

    return ( 
        <div className={Accountcss.contentAccount}>
            <p className='fs-3'>New Staff</p>
            <p className='fs-5'>Details</p>

            <Form.Control  type="text" placeholder="FullName" className='mb-2'/>
            <Form.Control  type="text" placeholder="Username" className='mb-2'/>
            <Form.Control  type="password" placeholder="Password" className='mb-2'/>
            <InputGroup className="mb-3">
                <Form.Control aria-label="Text input with dropdown button" placeholder={gender || 'Select Gender'} readOnly />

                <DropdownButton
                    variant="outline-secondary"
                    title="Dropdown"
                    id="input-group-dropdown-2"
                    align="end"
                    onSelect={handleGenderSelect}
                >
                    <Dropdown.Item eventKey="Male">Male</Dropdown.Item>
                    <Dropdown.Item eventKey="Female">Female</Dropdown.Item>
                </DropdownButton>
            </InputGroup>

            <Button type='button' variant='primary'>Create</Button>


        </div>
    );
}

export default AccountComp;