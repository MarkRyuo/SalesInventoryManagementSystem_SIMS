import { Row, Col, Form, Button } from "react-bootstrap";
import { IoSearch } from "react-icons/io5";


//* Props 
function ProductChart() {
    return (
        <>

            <Row>
                <Col>
                    {/* Search */}
                    <Form inline>
                        <Row className="d-flex justify-content-end g-1 my-4">
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

                </Col>
                <Col>

                </Col>
            </Row>

            <div style={{border: "1px solid red"}}>
                Item 1 
                {/* Insert Logic */}
            </div>
        </>
    )
}

export default ProductChart ;
