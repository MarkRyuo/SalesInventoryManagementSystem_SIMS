import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

function DropdownReports() {
    return (
        <DropdownButton id="dropdown-basic-button" title="Reports" variant=''>
            <Dropdown.Item href="#">Stock In Report</Dropdown.Item>
            <Dropdown.Item href="/LowStockReports">Low Stock Report</Dropdown.Item>
            <Dropdown.Item href="#">Total Sales Report</Dropdown.Item>
            <Dropdown.Item href="#">Quantity Sold Report</Dropdown.Item>
        </DropdownButton>
    )
}
export default DropdownReports ;
