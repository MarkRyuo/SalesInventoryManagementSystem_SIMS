import AddNewAssets from "../../components/StaffPortal/AddNewAssets/AddNewAssets";
import ScanAsset from "../../components/StaffPortal/ScanAsset/ScanAsset";
import SearchAssets from "../../components/StaffPortal/SearchAsset/SearchAsset";
import MainStaffLayout from "../../layout/MainStaffLayout";
import { Row, Col } from "react-bootstrap";
import SDashboardCss from './SDashboard.module.css' ;
import { useState } from "react";

function SDashboard() {

    const [buttons, setButtons] = useState([
        { btnName: "AddNewAssets", btnIcon: <TiDocumentAdd size={30} />, id: 1 },
        { btnName: "AddNewAssets", btnIcon: <TiDocumentAdd size={30} />, id: 2 },
        { btnName: "AddNewAssets", btnIcon: <TiDocumentAdd size={30} />, id: 3 },
    ])

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
