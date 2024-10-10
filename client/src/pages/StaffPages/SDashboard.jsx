import AddNewAssets from "../../components/AddNewAssets/AddNewAssets";
import MainStaffLayout from "../../layout/MainStaffLayout";
import { Row, Col } from "react-bootstrap";

function SDashboard() {
    return (
        <MainStaffLayout>
            <Row style={{
                border: "1px solid", 
                width: "100%", 
                height: "700px", 
                margin: 0, 
                justifyContent: "space-around", 
                flexDirection: "column", 
                alignContent: "center",
                }}>
                <Col lg={12} style={{
                    border: "1px solid", 
                    borderRadius: "10px", 
                    width: "100%", 
                    maxWidth: 300, 
                    height: 200, 
                    alignContent: "center"}}>
                    <AddNewAssets />
                </Col>
                <Col lg={12} style={{ border: "1px solid red", borderRadius: "10px", width: "100%", maxWidth: 300, height: 200, alignContent: "center" }}>
                    <AddNewAssets />
                </Col>
                <Col lg={12} style={{ border: "1px solid red", borderRadius: "10px", width: "100%", maxWidth: 300, height: 200, alignContent: "center" }}>
                    <AddNewAssets />
                </Col>
            </Row>
        </MainStaffLayout>
    )
}

export default SDashboard ;
