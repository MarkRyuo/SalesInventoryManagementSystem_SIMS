import { Row, Col, Form, Button, Dropdown, DropdownButton } from "react-bootstrap";
import { IoSearch } from "react-icons/io5";
import Productcss from './Product.module.css' ;


//* Props 
function ProductChart() {
    return (
        <>

            <Row>
                <Col lg={12}>
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
                <Col lg={12}>
                    <DropdownButton id="dropdown-basic-button" title="Category">
                        <Dropdown.Item >Product 1</Dropdown.Item>
                        <Dropdown.Item >Product 2</Dropdown.Item>
                        <Dropdown.Item >Product 3</Dropdown.Item>
                    </DropdownButton>
                </Col>
            </Row>
            

            <div className={Productcss.containerProduct}> {/* fix width(cannot lower 530px), overflow(On)*/}
                <div className={Productcss.colProduct}> {/* fix width(cannot lower 530px), overflow(On)*/}
                    <div className={Productcss.productContent}>
                        Items
                        {/* Insert Logic */}
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProductChart;
