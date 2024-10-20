import StaffNavBar from "../../components/StaffPortal/StaffNavbar/StaffNavBar";
import { Container } from "react-bootstrap"
import { useState } from "react";
import { IoMdArrowBack } from "react-icons/io";
import SearchAssetsMode from "../../components/StaffPortal/SearchAssets/SearchAssetsMode";


function SearchAsset() {

    const [backBtn] = useState([
        {
            btnIcon: <IoMdArrowBack size={20} />,
            path: "/SDashboard",
            id: 1
        }
    ]);
    return (
        <Container fluid className="p-0">
            <StaffNavBar backBtn={backBtn.filter(Backbtn => Backbtn.id === 1)} />
            <Container fluid='lg' className="mt-4">
                <SearchAssetsMode />
            </Container>
        </Container>
    )
}

export default SearchAsset ;
