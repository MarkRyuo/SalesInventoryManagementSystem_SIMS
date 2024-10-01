import { Dropdown, DropdownButton } from "react-bootstrap";


const ProductCategory = () => {
    return (
        <DropdownButton id="dropdown-basic-button" title="Category">
            <Dropdown.Item href="#/action-1">Item 1</Dropdown.Item>
            <Dropdown.Item href="#/action-2">Item 2</Dropdown.Item>
            <Dropdown.Item href="#/action-3">Item 3</Dropdown.Item>
        </DropdownButton>
    );
}

export default ProductCategory;