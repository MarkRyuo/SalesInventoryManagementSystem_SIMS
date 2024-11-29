import { useState } from 'react';
import { Nav } from 'react-bootstrap';
import { MainLayout } from "../../../layout/MainLayout";
import AccountPagescss from './AccountPage.module.scss';
import StaffComp from '../../../components/Account/StaffComp';
import ProfileMode from '../../../components/Account/ProfileMode';
import ProfileComp from '../../../components/Account/ProfileComp';

import { MdManageAccounts } from "react-icons/md";
import { MdSupervisorAccount } from "react-icons/md";
import { MdAccountCircle } from "react-icons/md";
// eslint-disable-next-line react/prop-types
function ProductNavbarTabs({ setActiveTab }) {
    return (
        <Nav variant="tabs" onSelect={setActiveTab} className={AccountPagescss.NavContainer}>
            <Nav.Item className={AccountPagescss.mainTabs}>
                <Nav.Link eventKey="/MyAccount" onClick={() => setActiveTab('/MyAccount')}>
                    <MdAccountCircle size={20}/>                    
                    <p className='m-0 p-0'>My Account</p>
                </Nav.Link>
            </Nav.Item>
            <Nav.Item className={AccountPagescss.mainTabs}>
                <Nav.Link eventKey="/ProfileComp" onClick={() => setActiveTab('/ProfileComp')}>
                    <MdManageAccounts size={20}/>
                    <p className='m-0 p-0'>Profile</p>
                </Nav.Link>
            </Nav.Item>
            <Nav.Item className={AccountPagescss.mainTabs}>
                <Nav.Link eventKey="/StaffComp" onClick={() => setActiveTab('/StaffComp')}>
                    <MdSupervisorAccount size={20}/>
                    <p className='m-0 p-0'>Staff Account</p>
                </Nav.Link>
            </Nav.Item>
        </Nav>
    );
}

export const ProductPage = () => {
    const [activeTab, setActiveTab] = useState('/MyAccount');

    return (
        <MainLayout>
            <div className={AccountPagescss.MyAccount}>
                <ProductNavbarTabs setActiveTab={setActiveTab} />
                <div className="ProductContent">
                    {activeTab === '/MyAccount' && (
                        <div className="Product">
                            <ProfileMode setActiveTab={setActiveTab}/>
                        </div>
                    )}
                    {activeTab === '/ProfileComp' && (
                        <div>
                            <ProfileComp setActiveTab={setActiveTab}/>
                        </div>
                    )}
                    {activeTab === '/StaffComp' && (
                        <div>
                            <StaffComp setActiveTab={setActiveTab}/>
                        </div>
                    )}
                    {activeTab === '/' && (
                        <div>
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
};

export default ProductPage;
