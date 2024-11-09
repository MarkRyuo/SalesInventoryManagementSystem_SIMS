import { useState } from 'react';
import { Nav } from 'react-bootstrap';
import { MainLayout } from "../../../layout/MainLayout";
import { AiFillProduct } from "react-icons/ai";
import Product from '../../../components/Charts/ProductChart/Product';
import { Container } from "react-bootstrap";
import ProductEditor from "../ProductEditor/ProductEditor";
import { FaRegEdit } from "react-icons/fa";
import AdminTransactionHistory from '../AdminTransactionHistory/AdminTransactionHistory'
import { FaHistory } from "react-icons/fa";

import ProductPagescss from './ProductPage.module.scss' ;


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
                <Nav.Link eventKey="/ProductEditor">
                    <FaRegEdit size={20} />
                    <p className='m-0 p-0'>Set Tax</p>
                </Nav.Link>
            </Nav.Item>
            <Nav.Item className={ProductPagescss.mainTabs}>
                <Nav.Link eventKey="/AdminTransactionHistory">
                    <FaHistory size={20}/>
                    <p className='m-0 p-0'>Transaction History</p>
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
                    {activeTab === '/ProductEditor' && (
                        <div className="ProductEditor">
                            <ProductEditor />
                        </div>
                    )}
                    {activeTab === '/AdminTransactionHistory' && (
                        <div className="Unknown">
                            <AdminTransactionHistory />
                        </div>
                    )}
                </div>
            </Container>
        </MainLayout>
    );
};

export default ProductPage;
