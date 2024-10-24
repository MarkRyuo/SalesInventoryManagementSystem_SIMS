import { Form, Button, Dropdown, Card, Spinner } from "react-bootstrap";
import { useState, useEffect } from "react";
import { getAllProducts, getCategories } from "../../../services/ProductService"; // Import your product service
import SDashboardCss from './SearchAssets.module.css'; // Create a CSS module for styling

function SearchAssetsMode() {
    const [searchTerm, setSearchTerm] = useState("");
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [filterOption, setFilterOption] = useState("Filter by"); // Default text for filter dropdown
    const [categories, setCategories] = useState([]); // State for categories
    const [selectedCategory, setSelectedCategory] = useState("Select a Category"); // Default text for category
    const [loading, setLoading] = useState(true); // State for loading

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true); // Set loading to true before fetching
            try {
                const allProducts = await getAllProducts();
                setProducts(Object.values(allProducts)); // Store products in state
                setFilteredProducts(Object.values(allProducts)); // Initially display all products
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false); // Set loading to false after fetching
            }
        };

        const fetchCategories = async () => {
            setLoading(true); // Set loading to true before fetching
            try {
                const allCategories = await getCategories();
                setCategories(allCategories); // Set categories state
            } catch (error) {
                console.error("Error fetching categories:", error);
            } finally {
                setLoading(false); // Set loading to false after fetching
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
                    (filterOption === "Filter by" && (
                        product.productName.toLowerCase().includes(lowercasedSearchTerm) ||
                        product.sku.toLowerCase().includes(lowercasedSearchTerm) ||
                        product.barcode.toLowerCase().includes(lowercasedSearchTerm)
                    )) ||
                    (filterOption === "Name" && product.productName.toLowerCase().includes(lowercasedSearchTerm)) ||
                    (filterOption === "Low Stock" && product.quantity < 5) || // Adjust threshold as needed
                    (filterOption === "In Stock" && product.quantity >= 5 && product.quantity <= 20) || // Adjust thresholds as needed
                    (filterOption === "High Stock" && product.quantity > 20) // Adjust threshold as needed
                );

                const matchesCategory = selectedCategory === "Select a Category" || selectedCategory === "All" || product.category === selectedCategory;

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
                        <Dropdown.Item onClick={() => setFilterOption("Filter by")}>Filter by</Dropdown.Item>
                        <Dropdown.Item onClick={() => setFilterOption("All")}>All</Dropdown.Item>
                        <Dropdown.Item onClick={() => setFilterOption("Name")}>Name</Dropdown.Item>
                        <Dropdown.Item onClick={() => setFilterOption("Low Stock")}>Low Stock</Dropdown.Item>
                        <Dropdown.Item onClick={() => setFilterOption("In Stock")}>In Stock</Dropdown.Item>
                        <Dropdown.Item onClick={() => setFilterOption("High Stock")}>High Stock</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                <Dropdown>
                    <Dropdown.Toggle variant="success" id="category-dropdown">
                        {selectedCategory}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={() => setSelectedCategory("Select a Category")}>Select a Category</Dropdown.Item>
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
                {loading ? (
                    <Spinner animation="border" variant="primary" />
                ) : filteredProducts.length > 0 ? (
                    filteredProducts.map(product => {
                        // Determine stock status
                        let stockStatus;
                        let statusColor;

                        if (product.quantity < 5) {
                            stockStatus = "Low Stock";
                            statusColor = "red"; // Color for low stock
                        } else if (product.quantity > 20) {
                            stockStatus = "High Stock";
                            statusColor = "green"; // Color for high stock
                        } else {
                            stockStatus = "In Stock";
                            statusColor = "yellow"; // Color for normal stock
                        }

                        return (
                            <Card key={product.barcode} className={SDashboardCss.productCard}>
                                <Card.Body>
                                    <Card.Title>{product.productName}</Card.Title>
                                    <Card.Subtitle className="mb-2 text-muted">SKU: {product.sku}</Card.Subtitle>
                                    <Card.Text>
                                        <strong>Barcode:</strong> {product.barcode}<br />
                                        <strong>Quantity:</strong> {product.quantity}<br />
                                        <strong>Category:</strong> {product.category} {/* Display category */}
                                        <div style={{ color: statusColor, marginTop: '10px' }}>
                                            {stockStatus} {/* Display stock status */}
                                        </div>
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        );
                    })
                ) : (
                    <p>No products found.</p>
                )}
            </div>
        </div>
    );
}

export default SearchAssetsMode;
