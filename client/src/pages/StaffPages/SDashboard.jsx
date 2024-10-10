import AddNewAssets from "../../components/StaffPortal/AddNewAssets/AddNewAssets";
import ScanAsset from "../../components/StaffPortal/ScanAsset/ScanAsset";
import SearchAssets from "../../components/StaffPortal/SearchAsset/SearchAsset";
import MainStaffLayout from "../../layout/MainStaffLayout";
import { Row, Col } from "react-bootstrap";
import SDashboardCss from './SDashboard.module.css' ;

function SDashboard() {
    return (
        <MainStaffLayout>
            <Row className={SDashboardCss.rowContainer}>
                <Col lg={4} md={12} sm={12} className={SDashboardCss.colContainer}>
                    <AddNewAssets />
                </Col>
                <Col lg={4} md={12} sm={12} className={SDashboardCss.colContainer}>
                    <ScanAsset />
                </Col>
                <Col lg={4} md={12} sm={12} className={SDashboardCss.colContainer}>
                    <SearchAssets />
                </Col>
            </Row>
        </MainStaffLayout>
    )
}

export default SDashboard ;
