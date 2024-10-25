import { Form, Dropdown, Card, Spinner, Row, Col } from "react-bootstrap";
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
            console.log("Searching for:", lowercasedSearchTerm, "with filter option:", filterOption);

            const filtered = products.filter(product => {
                const matchesSearchTerm = (
                    (filterOption === "All") || // If "All" is selected, all products match
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

                // Only apply category filter if filterOption is not "All"
                return matchesSearchTerm && (filterOption !== "All" ? matchesCategory : true);
            });

            console.log("Filtered products:", filtered);
            setFilteredProducts(filtered);
        };

        filterProducts();
    }, [searchTerm, filterOption, selectedCategory, products]);

    return (
        <div className={SDashboardCss.searchContainer}>
            <Row className={SDashboardCss.searchHeader}>
                <Col lg={12} style={{display: "flex", justifyContent: "flex-end"}}>
                    <Form className="p-2">
                        <Form.Control
                            type="search"
                            placeholder="Search"
                            className="me-2"
                            aria-label="Search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)} // Update search term
                        />
                    </Form>
                </Col>
                <div style={{display: "flex", gap: 10, padding: 10}}>
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
                </div>
            </Row>
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
                                    <Card.Title>
                                        <div className="d-inline-flex gap-3">
                                            <p className="fs-4 m-0 p-0">{product.productName}</p>
                                            <p style={{ color: statusColor}} className="p-0 m-0">
                                                <span style={{ color: statusColor }}>•</span>{stockStatus} {/* Display stock status */}
                                            </p>
                                        </div>
                                    </Card.Title>
                                    <Card.Subtitle className="mb-2 text-muted p-0 m-0">SKU: {product.sku}</Card.Subtitle>
                                    <Card.Text>
                                        <p className="p-0 m-0">Barcode: {product.barcode} </p>
                                        <p className="p-0 m-0">Quantity: {product.quantity}</p>
                                        <p>Category: {product.category}</p>
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
