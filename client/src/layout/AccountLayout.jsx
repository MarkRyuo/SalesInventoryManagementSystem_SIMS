import Sidebar from "../components/Account/SideBar";
import { MainLayout } from "./MainLayout";

function AccountPage() {
    return (
        <MainLayout>
            <div className="AccountMainComponent">
                <Sidebar />
            </div>
            
        </MainLayout>
    )
}

export default AccountPage ;
