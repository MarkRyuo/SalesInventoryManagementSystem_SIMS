import { useState } from 'react';
import { Nav } from 'react-bootstrap';
import { MainLayout } from "../layout/MainLayout";
import { AiFillProduct } from "react-icons/ai";
import Product from '../components/Charts/ProductChart/Product';
import { Container } from "react-bootstrap";
import ProductEditor from "./Admin/ProductEditor/ProductEditor";

// eslint-disable-next-line react/prop-types
function ProductNavbarTabs({ setActiveTab }) {
    return (
        <Nav justify variant="tabs" defaultActiveKey="/Product" className="mt-4" onSelect={setActiveTab}>
            <Nav.Item>
                <Nav.Link eventKey="/Product"><AiFillProduct />Product</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link eventKey="/ProductEditor">Product Edit</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link eventKey="#">Link</Nav.Link>
            </Nav.Item>
        </Nav>
    );
}

export const ProductPage = () => {
    const [activeTab, setActiveTab] = useState('/Product');

    return (
        <MainLayout>
            <Container className="ProductMain">
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
                </div>
            </Container>
        </MainLayout>
    );
};

export default ProductPage;
