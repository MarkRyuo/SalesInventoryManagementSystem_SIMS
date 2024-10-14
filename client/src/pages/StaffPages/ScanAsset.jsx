import StaffNavBar from "../../components/StaffPortal/StaffNavbar/StaffNavBar";
import { Container } from "react-bootstrap"
import { useState } from "react";
import { IoMdArrowBack } from "react-icons/io";


function ScanAsset() {

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
            <Container fluid='lg' className="mt-4" style={{ border: "1px solid", width: "100%", height: "auto" }}>
                <h2>Search Assets</h2> {/*Temporary */}
                <div style={{ border: "1px solid", height: "500px", width: "100%", minWidth: "350px" }}>
                    {/* Search Here */}
                </div>
            </Container>
        </Container>
    )
}

export default ScanAsset;
