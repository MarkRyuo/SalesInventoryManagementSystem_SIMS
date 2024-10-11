import { Row, Col, Form, Button, Dropdown, DropdownButton } from "react-bootstrap";
import { IoSearch } from "react-icons/io5";
import Productcss from './Product.module.css' ;


//* Props 
function ProductChart() {
    return (
        <>

            <Row>
                <Col>
                    <DropdownButton id="dropdown-basic-button" title="Category">
                        <Dropdown.Item >Product 1</Dropdown.Item>
                        <Dropdown.Item >Product 2</Dropdown.Item>
                        <Dropdown.Item >Product 3</Dropdown.Item>
                    </DropdownButton>
                </Col>
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
            </Row>
            
            
            <div className={Productcss.containerProduct}>
                <div className={Productcss.colProduct}>
                    <div style={{ border: "1px solid red" }}>
                        Item 1
                        {/* Insert Logic */}
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProductChart;
