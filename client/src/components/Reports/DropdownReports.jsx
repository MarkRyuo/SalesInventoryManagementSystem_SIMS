

function DropdownReports() {
    return (
        <div className="dropdown">
            <button
                className="btn btn-secondary dropdown-toggle"
                type="button"
                id="dropdownMenuButton"
                data-bs-toggle="dropdown"
                aria-expanded="false"
            >
                Dropdown button
            </button>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                <li><a className="dropdown-item" href="#">Stock In Report</a></li>
                <li><a className="dropdown-item" href="#">Low Stock Report</a></li>
                <li><a className="dropdown-item" href="#">Total Sales Report</a></li>
                <li><a className="dropdown-item" href="#">Quantity Sold Report</a></li>
            </ul>
        </div>

    )
}
export default DropdownReports ;
