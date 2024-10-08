import AddNewAssets from "../../components/StaffPortal/AddNewAssets/AddNewAssets";
import ScanAsset from "../../components/StaffPortal/ScanAsset/ScanAsset";
import SearchAssets from "../../components/StaffPortal/SearchAsset/SearchAsset";
import MainStaffLayout from "../../layout/MainStaffLayout";
import { Row, Col } from "react-bootstrap";

function SDashboard() {
    return (
        <MainStaffLayout>
            <Row style={{
                
                width: "100%", 
                height: "700px", 
                margin: 0, 
                justifyContent: "space-around", 
                flexDirection: "column", 
                alignContent: "center",
                }}>
                <Col lg={12} style={{
                    borderRadius: "10px", 
                    width: "100%", 
                    maxWidth: 300, 
                    height: 200, 
                    alignContent: "center",
                    boxShadow: "0px 8px 5px "
                    }}>
                    <AddNewAssets />
                </Col>
                <Col lg={12} style={{
                    borderRadius: "10px",
                    width: "100%",
                    maxWidth: 300,
                    height: 200,
                    alignContent: "center",
                    boxShadow: "0px 8px 5px "
                }}>
                    <ScanAsset />
                </Col>
                <Col lg={12} style={{
                    borderRadius: "10px",
                    width: "100%",
                    maxWidth: 300,
                    height: 200,
                    alignContent: "center",
                    boxShadow: "0px 8px 5px "
                }}>
                    <SearchAssets />
                </Col>
                
            </Row>
        </MainStaffLayout>
    )
}

export default SDashboard ;
