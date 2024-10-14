import MainStaffLayout from "../../layout/MainStaffLayout";
import { Row, Col } from "react-bootstrap";
import SDashboardCss from './SDashboard.module.css' ;
import { useState } from "react";
import StaffButtons from "../../components/StaffPortal/StaffButtons/StaffButtons";
//? Icons
import { TiDocumentAdd } from "react-icons/ti";
import { BiScan } from "react-icons/bi";
import { MdOutlineManageSearch } from "react-icons/md";

function SDashboard() {

    const [buttons] = useState([
        { btnName: "AddNewAssets", btnIcon: <TiDocumentAdd size={30} />, path: "/AddNewAssets", id: 1 },
        { btnName: "ScanAssets", btnIcon: <BiScan size={30} />, path: "/ScanAsset", id: 2},
        { btnName: "SearchAssets", btnIcon: <MdOutlineManageSearch size={30} />, path: "/SearchAssets", id: 3 },
    ])

    return (
        <MainStaffLayout>
            <Row className={SDashboardCss.rowContainer}>
                <Col lg={4} md={12} sm={12} className={SDashboardCss.colContainer}>
                    <div className={SDashboardCss.btnContainer1}>
                        <StaffButtons buttons={buttons.filter(button => button.id === 1)} />
                    </div>
                </Col>
                <Col lg={4} md={12} sm={12} className={SDashboardCss.colContainer}>
                    <div className={SDashboardCss.btnContainer2}>
                        <StaffButtons buttons={buttons.filter(button => button.id === 2)} />
                    </div>
                </Col>
                <Col lg={4} md={12} sm={12} className={SDashboardCss.colContainer}>
                    <div className={SDashboardCss.btnContainer3}>
                        <StaffButtons buttons={buttons.filter(button => button.id === 3)} />
                    </div>
                </Col>
            </Row>
        </MainStaffLayout>
    )
}

export default SDashboard ;
