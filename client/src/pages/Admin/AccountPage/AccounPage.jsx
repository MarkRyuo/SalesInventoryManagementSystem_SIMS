import { useState } from 'react';
import { Nav } from 'react-bootstrap';
import { MainLayout } from "../../../layout/MainLayout";
import { AiFillProduct } from "react-icons/ai";
import { Container } from "react-bootstrap";
import { FaHistory } from "react-icons/fa";
import { PiHandArrowUpBold } from "react-icons/pi";

import ProductPagescss from './ProductPage.module.scss';
import ReOrdering from './ReOrdering';
import SetQrcode from './SetQrcode';
import { LiaQrcodeSolid } from "react-icons/lia";
import MyAccount from '../../../components/Account/MyAccount';


// eslint-disable-next-line react/prop-types
function ProductNavbarTabs({ setActiveTab }) {
    return (
        <Nav justify variant="tabs" defaultActiveKey="/MyAccount" className="" onSelect={setActiveTab}>
            <Nav.Item className={ProductPagescss.mainTabs}>
                <Nav.Link eventKey="/">
                    <AiFillProduct size={20} />
                    <p className='m-0 p-0'>My Account</p>
                </Nav.Link>
            </Nav.Item>
            <Nav.Item className={ProductPagescss.mainTabs}>
                <Nav.Link eventKey="/">
                    <FaHistory size={20} />
                    <p className='m-0 p-0'>Profile</p>
                </Nav.Link>
            </Nav.Item>
            <Nav.Item className={ProductPagescss.mainTabs}>
                <Nav.Link eventKey="/">
                    <PiHandArrowUpBold size={20} />
                    <p className='m-0 p-0'></p>
                </Nav.Link>
            </Nav.Item>
            <Nav.Item className={ProductPagescss.mainTabs}>
                <Nav.Link eventKey="/">
                    <LiaQrcodeSolid size={20} />
                    <p className='m-0 p-0'>Set Qrcode</p>
                </Nav.Link>
            </Nav.Item>
        </Nav>
    );
}

export const ProductPage = () => {
    const [activeTab, setActiveTab] = useState('/Product');

    return (
        <MainLayout>
            <Container className={ProductPagescss.Products}>
                <ProductNavbarTabs setActiveTab={setActiveTab} />
                <div className="ProductContent">
                    {activeTab === '/' && (
                        <div className="Product">
                            <MyAccount />
                        </div>
                    )}
                    {activeTab === '/AdminTransactionHistory' && (
                        <div className="Unknown">

                        </div>
                    )}
                    {activeTab === '/ReOrdering' && (
                        <div className="Unknown">

                        </div>
                    )}
                    {activeTab === '/SetQrcode' && (
                        <div className="Unknown">
                            <SetQrcode />
                        </div>
                    )}
                </div>
            </Container>
        </MainLayout>
    );
};

export default ProductPage;
