import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { Link } from 'react-router-dom';

function DropdownReports() {
    return (
        <DropdownButton id="dropdown-basic-button" title="Reports" variant=''>
            <Link to={"/StockInReports"}>Stock In Report</Link>
            <Link href="/LowStockReports">Low Stock Report</Link>
            <Link href="/TotalSalesReports">Total Sales Report</Link>
        </DropdownButton>
    )
}
export default DropdownReports ;
