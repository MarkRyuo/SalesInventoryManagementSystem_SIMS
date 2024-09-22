import { MdDashboardCustomize } from "react-icons/md";
import { AiOutlineProduct } from "react-icons/ai";
import { TbReportSearch } from "react-icons/tb";
import { VscAccount } from "react-icons/vsc";

// or less ideally
import { Button } from 'react-bootstrap';

export const Buttons = () => {

    return (
        <>
            <Button variant="light"><MdDashboardCustomize size={25}/>Dashboard</Button>
            <Button variant="light"><AiOutlineProduct size={25}/>Product</Button>
            <Button variant="light"> <TbReportSearch size={25}/>Reports</Button>
            <Button variant="light"><VscAccount size={20}/>Accounts</Button>
        </>
    )
}