import { DropdownButton, Dropdown } from 'react-bootstrap'; import { Link } from 'react-router-dom';

function DropdownReports() {
    return (
        <DropdownButton id="dropdown-basic-button" title="Reports" variant="">
            <Dropdown.Item as={Link} to="/StockInReports">Stock In Report</Dropdown.Item>
            <Dropdown.Item as={Link} to="/LowStockReports">Low Stock Report</Dropdown.Item>
            <Dropdown.Item as={Link} to="/TotalSalesReports">Total Sales Report</Dropdown.Item>
        </DropdownButton>
    )
}
export default DropdownReports ;
