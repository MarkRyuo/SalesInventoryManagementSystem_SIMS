import { Form, Row, Col, Button } from "react-bootstrap";
import { IoSearch } from "react-icons/io5";

function Search() {
    return (
        <>
            <Form inline>
                <Row>
                    <Col xs="auto">
                        <Form.Control
                            type="text"
                            placeholder="Search Products"
                            className=" mr-sm-2"
                        />
                    </Col>
                    <Col xs="auto">
                        <Button type="submit" variant="primary"><IoSearch /></Button>
                    </Col>
                </Row>
            </Form>
        </>
    )
}

export default Search
