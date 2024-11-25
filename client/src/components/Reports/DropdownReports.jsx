import DropdownButton from 'react-bootstrap/DropdownButton';
import { Link } from 'react-router-dom';

function DropdownReports() {
    return (
        <DropdownButton id="dropdown-basic-button" title="Reports" variant='' className=''>
            <Link to={"/StockInReports"}>Stock In Report</Link>
            <Link to={"/LowStockReports"}>Low Stock Report</Link>
            <Link to={"/TotalSalesReports"}>Total Sales Report</Link>
        </DropdownButton>
    )
}
export default DropdownReports ;
