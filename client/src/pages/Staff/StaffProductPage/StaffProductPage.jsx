
import { useState } from 'react';
import { Nav } from 'react-bootstrap';
import { MainLayout } from "../../../layout/MainLayout";
import { AiFillProduct } from "react-icons/ai";
import Product from '../../../components/Charts/ProductChart/Product';
import { Container } from "react-bootstrap";
import AdminTransactionHistory from '../AdminTransactionHistory/AdminTransactionHistory'
import { FaHistory } from "react-icons/fa";
import { PiHandArrowUpBold } from "react-icons/pi";

import ProductPagescss from './ProductPage.module.scss' ;
import ReOrdering from './ReOrdering';
import SetQrcode from './SetQrcode';
import { LiaQrcodeSolid } from "react-icons/lia";

// eslint-disable-next-line react/prop-types
function ProductNavbarTabs({ setActiveTab }) {
    return (
        <Nav justify variant="tabs" defaultActiveKey="/Product" className="" onSelect={setActiveTab}>
            <Nav.Item className={ProductPagescss.mainTabs}>
                <Nav.Link eventKey="/Product">
                    <AiFillProduct size={20}/>
                    <p className='m-0 p-0'>Products</p>
                </Nav.Link>
            </Nav.Item>
            <Nav.Item className={ProductPagescss.mainTabs}>
                <Nav.Link eventKey="/AdminTransactionHistory">
                    <FaHistory size={20}/>
                    <p className='m-0 p-0'>Transaction History</p>
                </Nav.Link>
            </Nav.Item>
            <Nav.Item className={ProductPagescss.mainTabs}>
                <Nav.Link eventKey="/ReOrdering">
                    <PiHandArrowUpBold size={20} />
                    <p className='m-0 p-0'>Re Ordering</p>
                </Nav.Link>
            </Nav.Item>
            <Nav.Item className={ProductPagescss.mainTabs}>
                <Nav.Link eventKey="/SetQrcode">
                    <LiaQrcodeSolid size={20}/>
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
                    {activeTab === '/Product' && (
                        <div className="Product">
                            <Product />
                        </div>
                    )}
                    {activeTab === '/AdminTransactionHistory' && (
                        <div className="Unknown">
                            <AdminTransactionHistory />
                        </div>
                    )}
                    {activeTab === '/ReOrdering' && (
                        <div className="Unknown">
                            <ReOrdering />
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
