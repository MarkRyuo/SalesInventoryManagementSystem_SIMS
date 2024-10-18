import MainStaffLayout from "../../layout/MainStaffLayout";
import { Image } from "react-bootstrap";
import SDashboardCss from './SDashboard.module.css' ;
import { useState } from "react";
import StaffButtons from "../../components/StaffPortal/StaffButtons/StaffButtons";
//? Icons
import { TiDocumentAdd } from "react-icons/ti";
import { BiScan } from "react-icons/bi";
import { MdOutlineManageSearch } from "react-icons/md";

import { LiaProductHunt } from "react-icons/lia";
import CardProduct from "../../components/StaffPortal/Cards/CardProduct";


function SDashboard() {

    const [buttons] = useState([
        { btnName: "AddNewAssets", btnIcon: <TiDocumentAdd size={80} />, path: "/AddNewAssets", id: 1 },
        { btnName: "ScanAssets", btnIcon: <BiScan size={80} />, path: "/ScanAsset", id: 2},
        { btnName: "SearchAssets", btnIcon: <MdOutlineManageSearch size={80} />, path: "/SearchAssets", id: 3 },
    ])

    const [cardProduct] = useState([
        {
            productIcon: <LiaProductHunt size={30} />,
            productName: 'Sample',
            productValue: '01213224234',
            id: 'p1'
        }
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
                    <p className="fs-5 m-0 ps-4">Services</p>
                    <div className={SDashboardCss.buttonsHeroCard}>
                            <StaffButtons buttons={buttons.filter(button => button.id === 1)} />
                            <StaffButtons buttons={buttons.filter(button => button.id === 2)} />
                            <StaffButtons buttons={buttons.filter(button => button.id === 3)} />
                    </div>
                </div>

                <div>
                    <p>Product Add Today: </p>
                    <div className="">
                        <CardProduct cardProduct={cardProduct.filter(CardProducts => CardProducts.id === 'p1')}/>
                    </div>
                </div>
            </div>
        </MainStaffLayout>
    )
}

export default SDashboard ;
