import AddNewAssets from "../../components/AddNewAssets/AddNewAssets";
import MainStaffLayout from "../../layout/MainStaffLayout";
import { Row, Col } from "react-bootstrap";

function SDashboard() {
    return (
        <MainStaffLayout>
            <Row style={{border: "1px solid", width: "100%"}}>
                <Col sm={12} style={{border: "1px solid red", borderRadius: "10px"}}>
                    <AddNewAssets />
                </Col>
                <Col>

                </Col>
                <Col>

                </Col>
            </Row>
        </MainStaffLayout>
    )
}

export default SDashboard ;
