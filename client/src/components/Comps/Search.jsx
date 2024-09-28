import { Form, Row, Col, Button } from "react-bootstrap";
import { IoSearch } from "react-icons/io5";

function Search() {
    return (
        <>
            <Form inline>
                <Row className="d-flex justify-content-end g-0">
                    <Col lg={3} xs={8} md={5}>
                        <Form.Control
                            type="text"
                            placeholder="Search Products"
                            className=" mr-sm-2"
                        />
                    </Col>
                    <Col lg={1} xs={2} md={2}>
                        <Button type="submit" variant="primary"><IoSearch /></Button>
                    </Col>
                </Row>
            </Form>
        </>
    )
}

export default Search
