import { useState } from "react";
import Container from 'react-bootstrap/Container';

function StaffNavbar() {

    const [backBtn] = useState([
        {
            btnIcon: "",
            path: "#"
        }
    ])

    return (
        <>
            {backBtn.map((Backbtn) => (
                <div>
                    
                </div>
            ))}
        </>
    )
}

export default StaffNavbar;
