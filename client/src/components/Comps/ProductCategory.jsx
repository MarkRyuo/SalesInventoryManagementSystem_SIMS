import { Dropdown, DropdownButton } from "react-bootstrap";


const ProductCategory = () => {
    return (
        <DropdownButton id="dropdown-basic-button" title="Category">
            <Dropdown.Item href="#">Product 1</Dropdown.Item>
            <Dropdown.Item href="#">Product 2</Dropdown.Item>
            <Dropdown.Item href="#">Item 3</Dropdown.Item>
        </DropdownButton>
    );
}

export default ProductCategory;



