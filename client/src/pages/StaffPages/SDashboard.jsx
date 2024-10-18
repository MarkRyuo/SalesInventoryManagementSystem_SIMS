import MainStaffLayout from "../../layout/MainStaffLayout";
import { Row, Col, Image } from "react-bootstrap";
import SDashboardCss from './SDashboard.module.css' ;
import { useState } from "react";
import StaffButtons from "../../components/StaffPortal/StaffButtons/StaffButtons";
//? Icons
import { TiDocumentAdd } from "react-icons/ti";
import { BiScan } from "react-icons/bi";
import { MdOutlineManageSearch } from "react-icons/md";
import { MdQrCodeScanner } from "react-icons/md";

function SDashboard() {

    const [buttons] = useState([
        { btnName: "AddNewAssets", btnIcon: <TiDocumentAdd size={30} />, path: "/AddNewAssets", id: 1 },
        { btnName: "ScanAssets", btnIcon: <BiScan size={30} />, path: "/ScanAsset", id: 2},
        { btnName: "SearchAssets", btnIcon: <MdOutlineManageSearch size={30} />, path: "/SearchAssets", id: 3 },
    ])

    return (
        <MainStaffLayout>

            <div className={SDashboardCss.mainComponent}>
                <div className={SDashboardCss.componentHeroCard}>
                    <Image 
                        src="https://i.pinimg.com/control/564x/6a/61/32/6a6132119767a37330924720a5733a96.jpg" 
                        roundedCircle 
                        style={{ width: '100%', maxWidth: '100px', height: '100px' }}
                        />
                    <div>
                        <p className="fs-4 m-0"><span className="fw-semibold">Hello, </span> <span>{/* fetch the gender if male is Mr if female is Ms */}</span> {/* fetch staff firstname and lastname */}</p>
                        <p className="m-0">REYES ELECTRONICS.</p>
                        <p>Date: {/* Add a realtime date */}</p>
                    </div>
                </div>

                <div className={SDashboardCss.containerHeroCard}>
                    <p className="fs-4">Services</p>
                    <div className={SDashboardCss.buttonsHeroCard}>
                        <div style={{ display: "flex", flexDirection: "column", padding: 20, boxShadow: '2px 2px 5px #e2dfdf', borderRadius: 20 }}>
                            <span className="text-center"><MdQrCodeScanner size={100}/></span>
                            <StaffButtons buttons={buttons.filter(button => button.id === 1)} />
                        </div>
                        <StaffButtons buttons={buttons.filter(button => button.id === 2)} />
                        <StaffButtons buttons={buttons.filter(button => button.id === 3)} />

                    </div>
                </div>

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
            </div>
        </MainStaffLayout>
    )
}

export default SDashboard ;
