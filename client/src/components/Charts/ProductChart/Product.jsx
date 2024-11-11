import { Row, Col, Form, Dropdown, DropdownButton, Spinner } from "react-bootstrap";
import Productcss from './Product.module.scss';
import { useEffect, useState } from "react";
import { getAllProducts, getCategories } from "../../../services/ProductService";
import SetCategory from "../../../pages/Admin/ProductPage/SetCategory";
import SetDiscounts from "../../../pages/Admin/ProductPage/SetDiscounts";

function ProductChart() {
    const [searchTerm, setSearchTerm] = useState("");
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("All Category");
    const [selectedStock, setSelectedStock] = useState("All Stock");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProductsAndCategories = async () => {
            setLoading(true);
            try {
                const allProducts = await getAllProducts();
                setProducts(Object.values(allProducts));
                setFilteredProducts(Object.values(allProducts));
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
                // Matching product name with search term
                const matchesSearchTerm = product.productName.toLowerCase().includes(lowercasedSearchTerm);
                const matchesCategory = selectedCategory === "All Category" || product.category === selectedCategory;

                // Calculate low stock and high stock based on instockthreshold
                const instockthreshold = product.instockthreshold || 0;  // Default to 0 if instockthreshold is not set
                const lowStockThreshold = instockthreshold > 0 ? instockthreshold / 4 : 0; // Low stock is 1/4th of the threshold

                // Determine stock status
                let matchesStock = false;
                if (selectedStock === "All Stock") {
                    matchesStock = true; // No stock filter, show everything
                } else if (selectedStock === "In Stock" && product.quantity >= instockthreshold) {
                    matchesStock = true; // Quantity >= threshold for "In Stock"
                } else if (selectedStock === "Low Stock" && product.quantity > 0 && product.quantity <= lowStockThreshold) {
                    matchesStock = true; // Quantity <= lowStockThreshold for "Low Stock"
                } else if (selectedStock === "High Stock" && product.quantity > instockthreshold) {
                    matchesStock = true; // Quantity > threshold for "High Stock"
                } else if (selectedStock === "Out of Stock" && product.quantity === 0) {
                    matchesStock = true; // Quantity === 0 for "Out of Stock"
                } else if (selectedStock === "Threshold not set" && instockthreshold === 0) {
                    matchesStock = true; // Show products with no instockthreshold
                }

                return matchesSearchTerm && matchesCategory && matchesStock;
            });

            setFilteredProducts(filtered);
        };

        filterProducts();
    }, [searchTerm, selectedCategory, selectedStock, products]);




    const getStockStatus = (quantity, instockthreshold) => {
        // If instockthreshold is not set, display a default message
        if (!instockthreshold) {
            return { text: "Threshold not set", color: "gray" };
        }

        const lowStockThreshold = instockthreshold / 4;  // 1/4th of instockthreshold

        // Check for High Stock first (greater than instockthreshold)
        if (quantity > instockthreshold) {
            return { text: "High Stock", color: "blue" };
        }

        // Check for In Stock (equal to or greater than the instockthreshold)
        if (quantity >= instockthreshold) {
            return { text: "In Stock", color: "green" };
        }

        // Check for Low Stock (greater than 0 but less than or equal to 1/4 of instockthreshold)
        if (quantity > 0 && quantity <= lowStockThreshold) {
            return { text: "Low Stock", color: "orange" };
        }

        // Check for Out of Stock (quantity is 0)
        if (quantity === 0) {
            return { text: "Out of Stock", color: "red" };
        }

        // Default fallback for edge cases (should not be reached)
        return { text: "Out of Stock", color: "red" };
    };


    return (
        <>
            <Row className="my-4">
                <div style={{ border: '1px solid' }}>
                    <div>
                        <SetCategory />
                    </div>
                    <div>
                        {/* Create Barcode */}
                    </div>
                    <div>
                        {/* Discount */}
                        <SetDiscounts />
                    </div>
                </div>
                <Col lg={12}>
                    <Form inline className="d-flex justify-content-end m-3">
                        <Col lg={3}>
                            <Form.Control
                                type="text"
                                placeholder="Search Products"
                                className="mr-sm-2"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </Col>
                    </Form>
                </Col>
                <div style={{ display: "inline-flex", gap: 70, marginTop: 10 }}>
                    <div>
                        <DropdownButton
                            id="dropdown-basic-button"
                            title={selectedCategory}
                            className="ms-3"
                            onSelect={(eventKey) => setSelectedCategory(eventKey)}
                        >
                            <Dropdown.Item eventKey="All Category">All Category</Dropdown.Item>
                            {categories.map((category, index) => (
                                <Dropdown.Item eventKey={category.id} key={index}>
                                    {category.name}
                                </Dropdown.Item>
                            ))}
                        </DropdownButton>
                    </div>
                    <div>
                        <DropdownButton
                            id="stock-dropdown"
                            title={selectedStock}
                            className="ms-3"
                            onSelect={(eventKey) => setSelectedStock(eventKey)}
                        >
                            <Dropdown.Item eventKey="All Stock">All Stock</Dropdown.Item>
                            <Dropdown.Item eventKey="In Stock">In Stock</Dropdown.Item>
                            <Dropdown.Item eventKey="Low Stock">Low Stock</Dropdown.Item>
                            <Dropdown.Item eventKey="High Stock">High Stock</Dropdown.Item>
                            <Dropdown.Item eventKey="Out of Stock">Out of Stock</Dropdown.Item>
                            <Dropdown.Item eventKey="Threshold not set">Threshold not set</Dropdown.Item>
                        </DropdownButton>
                    </div>
                </div>
            </Row>

            <div className={Productcss.containerProduct}>
                <div className={Productcss.colProduct}>
                    <div className={Productcss.productContent}>
                        {loading ? (
                            <Spinner animation="border" variant="primary" />
                        ) : (
                            filteredProducts.length > 0 ? (
                                filteredProducts.map(product => {
                                    const { text, color } = getStockStatus(product.quantity, product.instockthreshold);  // Pass instockthreshold here
                                    return (
                                        <div key={product.barcode} className={Productcss.productCard}>
                                            <div>
                                                <div className="d-flex">
                                                    <p className="m-0 pb-2">{product.productName}</p>
                                                    <p style={{ color: color, fontSize: '0.9rem' }} className="pt-2 m-0">
                                                        <span style={{ color: color }} className="p-0">•</span> {text}
                                                    </p>
                                                </div>
                                                <div className={Productcss.lastChild}>
                                                    <p className="m-0 p-0">SKU: {product.sku}</p>
                                                    <p className="m-0 p-0">Quantity: {product.quantity}</p>
                                                    <p>Category: {product.category}</p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
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
