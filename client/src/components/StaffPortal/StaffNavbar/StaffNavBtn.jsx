import { useState } from "react";
import Button from 'react-bootstrap' ;
import { IoMdArrowBack } from "react-icons/io";

function StaffNavBtn() {

    const [backBtn] = useState([
        {
            btnIcon: <IoMdArrowBack />,
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
