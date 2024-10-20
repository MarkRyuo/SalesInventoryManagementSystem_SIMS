import { Form, Button } from "react-bootstrap"

//* Search Product
function SearchAssetsMode() {
    return (
        <div style={{ border: "1px solid", width: "100%", height: "auto" }}>
            <div>
                <Form className="d-flex">
                    <Form.Control
                        type="search"
                        placeholder="Search"
                        className="me-2"
                        aria-label="Search"
                    />
                    <Button variant="outline-success">Search</Button>
                </Form>
            </div>
            <div>

            </div>
        </div>
    )
}

export default SearchAssetsMode
