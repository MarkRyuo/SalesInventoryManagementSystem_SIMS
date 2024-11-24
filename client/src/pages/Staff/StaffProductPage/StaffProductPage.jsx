
import { useState } from 'react';
import { Nav } from 'react-bootstrap';
import MainStaffLayout from '../../../layout/MainStaffLayout';
import { AiFillProduct } from "react-icons/ai";
import Product from '../../../components/Charts/ProductChart/Product';
import { Container } from "react-bootstrap";
import { FaHistory } from "react-icons/fa";
import { PiHandArrowUpBold } from "react-icons/pi";
import StaffProductPagescss from './StaffProductPage.module.scss' ;
import ReOrdering from '../../Admin/ProductPage/ReOrdering';
import SetQrcode from '../../Admin/ProductPage/SetQrcode';
import { LiaQrcodeSolid } from "react-icons/lia";

// eslint-disable-next-line react/prop-types
function ProductNavbarTabs({ setActiveTab }) {
    return (
        <Nav justify variant="tabs" defaultActiveKey="/Product" className="" onSelect={setActiveTab}>
            <Nav.Item className={StaffProductPagescss.mainTabs}>
                <Nav.Link eventKey="/Product">
                    <AiFillProduct size={20}/>
                    <p className='m-0 p-0'>Products</p>
                </Nav.Link>
            </Nav.Item>
            <Nav.Item className={StaffProductPagescss.mainTabs}>
                <Nav.Link eventKey="/AdminTransactionHistory">
                    <FaHistory size={20}/>
                    <p className='m-0 p-0'>Transaction History</p>
                </Nav.Link>
            </Nav.Item>
            <Nav.Item className={StaffProductPagescss.mainTabs}>
                <Nav.Link eventKey="/ReOrdering">
                    <PiHandArrowUpBold size={20} />
                    <p className='m-0 p-0'>Re Ordering</p>
                </Nav.Link>
            </Nav.Item>
            <Nav.Item className={StaffProductPagescss.mainTabs}>
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
        <MainStaffLayout>
            <Container className={StaffProductPagescss.Products}>
                <ProductNavbarTabs setActiveTab={setActiveTab} />
                <div className="ProductContent">
                    {activeTab === '/Product' && (
                        <div className="Product">
                            <Product />
                        </div>
                    )}
                    {activeTab === '/AdminTransactionHistory' && (
                        <div className="Unknown">

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
        </MainStaffLayout>
    );
};

export default ProductPage;
