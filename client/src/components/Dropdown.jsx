import { InputGroup, DropdownButton, Dropdown } from 'react-bootstrap';



const Dropdown = () => {

    const [gender, setGender] = useState('');

    // Function to handle gender selection
    const handleGenderSelect = (eventKey) => {
        setGender(eventKey); // Updates the gender state with the selected value
    };

    return (
        <>
            <InputGroup className="mb-3 ps-2" style={{ width: "100%", maxWidth: "500px" }}>
                <Form.Control
                    aria-label="Text input with dropdown button"
                    placeholder={gender || 'Select Gender'}
                    readOnly
                />

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
        </>
    );
}

export default Dropdown;