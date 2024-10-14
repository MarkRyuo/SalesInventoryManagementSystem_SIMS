import { useState } from "react";
import Button from 'react-bootstrap' ;

function StaffNavBtn() {

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
                <Button key={Backbtn.id}>
                    {Backbtn.btnIcon}
                </Button>
            ))}
        </>
    )
}

export default StaffNavBtn;
