import { Form, Button, Dropdown, Card } from "react-bootstrap";
import { useState, useEffect } from "react";
import { getAllProducts, getCategories } from "../../../services/ProductService"; // Import your product service
import SDashboardCss from './SearchAssets.module.css'; // Create a CSS module for styling

function SearchAssetsMode() {
    const [searchTerm, setSearchTerm] = useState("");
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [filterOption, setFilterOption] = useState("All");
    const [categories, setCategories] = useState([]); // State for categories
    const [selectedCategory, setSelectedCategory] = useState("All"); // State for selected category

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const allProducts = await getAllProducts();
                setProducts(Object.values(allProducts)); // Store products in state
                setFilteredProducts(Object.values(allProducts)); // Initially display all products
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        const fetchCategories = async () => {
            try {
                const allCategories = await getCategories();
                setCategories(allCategories); // Set categories state
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchProducts();
        fetchCategories();
    }, []);

    useEffect(() => {
        const filterProducts = () => {
            const lowercasedSearchTerm = searchTerm.toLowerCase();

            const filtered = products.filter(product => {
                const matchesSearchTerm = (
                    (filterOption === "All" && (
                        product.productName.toLowerCase().includes(lowercasedSearchTerm) ||
                        product.sku.toLowerCase().includes(lowercasedSearchTerm) ||
                        product.barcode.toLowerCase().includes(lowercasedSearchTerm)
                    )) ||
                    (filterOption === "Name" && product.productName.toLowerCase().includes(lowercasedSearchTerm)) ||
                    (filterOption === "SKU" && product.sku.toLowerCase().includes(lowercasedSearchTerm)) ||
                    (filterOption === "Barcode" && product.barcode.toLowerCase().includes(lowercasedSearchTerm))
                );

                const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;

                return matchesSearchTerm && matchesCategory; // Both search term and category must match
            });

            setFilteredProducts(filtered);
        };

        filterProducts();
    }, [searchTerm, filterOption, selectedCategory, products]);

    return (
        <div className={SDashboardCss.searchContainer}>
            <div className={SDashboardCss.searchHeader}>
                <Dropdown>
                    <Dropdown.Toggle variant="success" id="filter-dropdown">
                        {filterOption}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={() => setFilterOption("All")}>All</Dropdown.Item>
                        <Dropdown.Item onClick={() => setFilterOption("Name")}>Name</Dropdown.Item>
                        <Dropdown.Item onClick={() => setFilterOption("SKU")}>SKU</Dropdown.Item>
                        <Dropdown.Item onClick={() => setFilterOption("Barcode")}>Barcode</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                <Dropdown>
                    <Dropdown.Toggle variant="success" id="category-dropdown">
                        {selectedCategory}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={() => setSelectedCategory("All")}>All</Dropdown.Item>
                        {categories.map(category => (
                            <Dropdown.Item key={category} onClick={() => setSelectedCategory(category)}>
                                {category}
                            </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                </Dropdown>
                <Form className="d-flex" style={{ width: 380 }}>
                    <Form.Control
                        type="search"
                        placeholder="Search"
                        className="me-2"
                        aria-label="Search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)} // Update search term
                    />
                    <Button variant="outline-success">Search</Button>
                </Form>
            </div>
            <div className={SDashboardCss.resultsContainer}>
                {filteredProducts.length > 0 ? (
                    filteredProducts.map(product => (
                        <Card key={product.barcode} className={SDashboardCss.productCard}>
                            <Card.Body>
                                <Card.Title>{product.productName}</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">SKU: {product.sku}</Card.Subtitle>
                                <Card.Text>
                                    <strong>Barcode:</strong> {product.barcode}<br />
                                    <strong>Quantity:</strong> {product.quantity}<br />
                                    <strong>Category:</strong> {product.category} {/* Display category */}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    ))
                ) : (
                    <p>No products found.</p>
                )}
            </div>
        </div>
    );
}

export default SearchAssetsMode;
