import { useState } from 'react';
import { Nav } from 'react-bootstrap';
import { MainLayout } from "../../../layout/MainLayout";
import { AiFillProduct } from "react-icons/ai";
import { Container } from "react-bootstrap";
import { FaHistory } from "react-icons/fa";
import { PiHandArrowUpBold } from "react-icons/pi";
import AccountPagescss from './AccountPage.module.scss';
import StaffComp from '../../../components/Account/StaffComp';
import ProfileComp from '../../../components/Account/ProfileComp';
import ProfileMode from '../../../components/Account/ProfileMode';
// eslint-disable-next-line react/prop-types
function ProductNavbarTabs({ setActiveTab }) {
    return (
        <Nav variant="tabs" onSelect={setActiveTab} className={AccountPagescss.NavContainer}>
            <Nav.Item className={AccountPagescss.mainTabs}>
                <Nav.Link eventKey="/MyAccount">
                    <AiFillProduct size={20} />
                    <p className='m-0 p-0'>My Account</p>
                </Nav.Link>
            </Nav.Item>
            <Nav.Item className={AccountPagescss.mainTabs}>
                <Nav.Link eventKey="/Profile">
                    <FaHistory size={20} />
                    <p className='m-0 p-0'>Profile</p>
                </Nav.Link>
            </Nav.Item>
            <Nav.Item className={AccountPagescss.mainTabs}>
                <Nav.Link eventKey="/StaffComp">
                    <PiHandArrowUpBold size={20} />
                    <p className='m-0 p-0'>Staff Account</p>
                </Nav.Link>
            </Nav.Item>
            {/* <Nav.Item className={AccountPagescss.mainTabs}>
                <Nav.Link eventKey="/SetQrcode">
                    <LiaQrcodeSolid size={20} />
                    <p className='m-0 p-0'>Set Qrcode</p>
                </Nav.Link>
            </Nav.Item> */}
        </Nav>
    );
}

export const ProductPage = () => {
    const [activeTab, setActiveTab] = useState('/MyAccount');

    return (
        <MainLayout>
            <Container className={AccountPagescss.MyAccount}>
                <ProductNavbarTabs setActiveTab={setActiveTab} />
                <div className="ProductContent">
                    {activeTab === '/MyAccount' && (
                        <div className="Product">
                            <ProfileMode />
                        </div>
                    )}
                    {activeTab === '/Profile' && (
                        <div className="Unknown">
                            <ProfileComp />
                        </div>
                    )}
                    {activeTab === '/StaffComp' && (
                        <div className="Unknown">
                            <StaffComp />
                        </div>
                    )}
                    {activeTab === '/SetQrcode' && (
                        <div className="Unknown">
                            {/* Add content for Set Qrcode */}
                        </div>
                    )}
                </div>
            </Container>
        </MainLayout>
    );
};

export default ProductPage;
