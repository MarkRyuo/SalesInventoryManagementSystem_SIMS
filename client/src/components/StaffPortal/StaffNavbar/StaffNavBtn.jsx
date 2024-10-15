import { useState } from "react";

function () {

    const [backBtn] = useState([
        {
            btnIcon: "",
            path: "#",
            id: 1
        }
    ])

    return (
        <>
            {backBtn.map((Backbtn) => (
                <div key={Backbtn.id}>
                    <span>{Backbtn.btnIcon}</span>
                </div>
            ))}
        </>
    )
}

export default StaffNavbar;
