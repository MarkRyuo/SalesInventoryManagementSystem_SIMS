
import { useState } from 'react';
import { Nav } from 'react-bootstrap';
import MainStaffLayout from '../../../layout/MainStaffLayout';
import { AiFillProduct } from "react-icons/ai";
import StaffProduct from '../../../components/Charts/ProductChart/StaffProduct';
import { FaHistory } from "react-icons/fa";
// import { PiHandArrowUpBold } from "react-icons/pi";
import StaffProductPagescss from './StaffProductPage.module.scss' ;
import ReOrdering from '../../Admin/ProductPage/ReOrdering';
import SetQrcode from '../../Admin/ProductPage/SetQrcode';
import { LiaQrcodeSolid } from "react-icons/lia";
import StaffTransactionHistory from '../StaffTransactionHistory/StaffTransactionHistory'

// eslint-disable-next-line react/prop-types
function ProductNavbarTabs({ setActiveTab }) {
    return (
        <Nav justify variant="tabs" defaultActiveKey="/StaffProduct" className="" onSelect={setActiveTab}>
            <Nav.Item className={StaffProductPagescss.mainTabs}>
                <Nav.Link eventKey="/StaffProduct">
                    <AiFillProduct size={20}/>
                    <p className='m-0 p-0'>Products</p>
                </Nav.Link>
            </Nav.Item>
            <Nav.Item className={StaffProductPagescss.mainTabs}>
                <Nav.Link eventKey="/StaffTransactionHistory">
                    <FaHistory size={20}/>
                    <p className='m-0 p-0'>Transaction History</p>
                </Nav.Link>
            </Nav.Item>
            {/* <Nav.Item className={StaffProductPagescss.mainTabs}>
                <Nav.Link eventKey="/ReOrdering">
                    <PiHandArrowUpBold size={20} />
                    <p className='m-0 p-0'>Re Ordering</p>
                </Nav.Link>
            </Nav.Item> */}
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
    const [activeTab, setActiveTab] = useState('/StaffProduct');

    return (
        <MainStaffLayout>
            <div className={StaffProductPagescss.Products}>
                <ProductNavbarTabs setActiveTab={setActiveTab} />
                <div className="ProductContent">
                    {activeTab === '/StaffProduct' && (
                        <div className="Product">
                            <StaffProduct /> 
                        </div>
                    )}
                    {activeTab === '/StaffTransactionHistory' && (
                        <div className="Unknown">
                            <StaffTransactionHistory />
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
            </div>
        </MainStaffLayout>
    );
};

export default ProductPage;
