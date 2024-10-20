import { Form, Button } from 'react-bootstrap';

//* Search Product
function SearchAssetsMode() {
    return (
        <div style={{ border: "1px solid", width: "100%", height: "auto" }}>
            <div>
                <Form inline onSubmit={handleSearch} className="mb-3">
                    <Form.Control
                        type="text"
                        placeholder="Search..."
                        value={query}
                        onChange={handleInputChange}
                        className="mr-sm-2"
                    />
                    <Button type="submit" variant="primary">
                        Search
                    </Button>
                </Form>
            </div>
            <div>

            </div>
        </div>
    )
}

export default SearchAssetsMode
