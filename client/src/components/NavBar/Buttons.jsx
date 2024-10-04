import { MdDashboardCustomize } from "react-icons/md";
import { AiOutlineProduct } from "react-icons/ai";
import { TbReportSearch } from "react-icons/tb";
import { VscAccount } from "react-icons/vsc";

import { Link } from 'react-router-dom' ;
import { Button } from 'react-bootstrap';

export const Buttons = () => {

    return (
        <>
            <Button as={Link} to="/DashboardPage" variant="light"><MdDashboardCustomize size={25}/>Dashboard</Button>
            <Button as={Link} to="/ProductPage" variant="light"><AiOutlineProduct size={25}/>Product</Button>
            <Button as={Link} to="/ReportPage" variant="light"> <TbReportSearch size={25}/>Reports</Button>
            <Button as={Link} to="/AccountPage" variant="light"><VscAccount size={20}/>Accounts</Button>
            <Button as={Link} to="/" variant="light"><VscAccount size={20} />Logout</Button>
        </>
    )
}