import Sidebar from "./SideBar";
import { MainLayout } from "../../layout/MainLayout";

function AccountPage() {
    return (
        <MainLayout>
            <div className="AccounMain">
                <Sidebar />
            </div>
        </MainLayout>
    )
}

export default AccountPage ;
