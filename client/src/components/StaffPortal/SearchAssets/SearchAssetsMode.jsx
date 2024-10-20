import { Form, Button, Dropdown } from "react-bootstrap"

//* Search Product
function SearchAssetsMode() {
    return (
        <div style={{ border: "1px solid", width: "100%", height: "auto", padding: 10}}>
            <div style={{display: 'flex', gap: '30px', flexDirection: 'column-reverse'}}>
                <Dropdown>
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                        Choose
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item href="#">Action</Dropdown.Item>
                        <Dropdown.Item href="#">Another action</Dropdown.Item>
                        <Dropdown.Item href="#">Something else</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                <div style={{display: 'flex', justifyContent: "flex-end"}}>
                    <Form className="d-flex" style={{ width: 380}}>
                        <Form.Control
                            type="search"
                            placeholder="Search"
                            className="me-2"
                            aria-label="Search"
                        />
                        <Button variant="outline-success">Search</Button>
                    </Form>
                </div>
            </div>
            <div>

            </div>
        </div>
    )
}

export default SearchAssetsMode
