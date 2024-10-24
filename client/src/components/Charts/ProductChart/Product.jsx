import { Row, Col, Form, Button, Dropdown, DropdownButton, Spinner } from "react-bootstrap";
import Productcss from './Product.module.css';
import { useEffect, useState } from "react";
import { getAllProducts, getCategories } from "../../../services/ProductService"; // Ensure to import your service

function ProductChart() {
    const [searchTerm, setSearchTerm] = useState("");
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProductsAndCategories = async () => {
            setLoading(true);
            try {
                const allProducts = await getAllProducts();
                setProducts(Object.values(allProducts)); // Convert object to array
                setFilteredProducts(Object.values(allProducts)); // Initially display all products
                const allCategories = await getCategories();
                setCategories(allCategories);
            } catch (error) {
                console.error("Error fetching products or categories:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProductsAndCategories();
    }, []);

    useEffect(() => {
        const filterProducts = () => {
            const lowercasedSearchTerm = searchTerm.toLowerCase();
            const filtered = products.filter(product => {
                const matchesSearchTerm = product.productName.toLowerCase().includes(lowercasedSearchTerm);
                const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
                return matchesSearchTerm && matchesCategory;
            });
            setFilteredProducts(filtered);
        };

        filterProducts();
    }, [searchTerm, selectedCategory, products]);

    return (
        <>
            <Row className="my-4">
                <Col lg={12}>
                    <Form inline className="d-flex justify-content-end">
                        <Col lg={3} xs={8} md={5}>
                            <Form.Control
                                type="text"
                                placeholder= "Search Products"
                                className="mr-sm-2"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)} // Update search term
                            />
                        </Col>
                    </Form>
                </Col>
                <Col lg={12}>
                    <DropdownButton id="dropdown-basic-button" title={selectedCategory} className="ms-3" onSelect={(eventKey) => setSelectedCategory(eventKey)}>
                        <Dropdown.Item eventKey="All">All</Dropdown.Item>
                        {categories.map((category, index) => (
                            <Dropdown.Item eventKey={category} key={index}>{category}</Dropdown.Item>
                        ))}
                    </DropdownButton>
                </Col>
            </Row>

            <div className={Productcss.containerProduct}>
                <div className={Productcss.colProduct}>
                    <div className={Productcss.productContent}>
                        {loading ? (
                            <Spinner animation="border" variant="primary" />
                        ) : (
                            filteredProducts.length > 0 ? (
                                filteredProducts.map(product => (
                                    <div key={product.barcode} className={Productcss.productCard}>
                                        {/* Display your product details here */}
                                        <p className="fs-4">{product.productName}</p>
                                        <p className="fs-6 m-0 p-0">SKU: {product.sku}</p>
                                        <p className="fs-6 m-0 p-0">Quantity: {product.quantity}</p>
                                        <p>Category: {product.category}</p>
                                    </div>
                                ))
                            ) : (
                                <p>No products found.</p>
                            )
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default ProductChart;
