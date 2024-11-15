import { Row, Col, Form, Dropdown, DropdownButton, Spinner } from "react-bootstrap";
import Productcss from './Product.module.scss';
import { useEffect, useState } from "react";
import { getAllProducts, getCategories } from "../../../services/ProductService";
import SetCategory from "../../../pages/Admin/ProductPage/SetCategory";
import SetDiscounts from "../../../pages/Admin/ProductPage/SetDiscounts";
import SetTax from "../../../pages/Admin/ProductPage/SetTax";

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
    
                // Use getStockStatus to determine the stock status of the product
                const stockStatus = getStockStatus(product.quantity, product.instockthreshold).text;
    
                // Determine if the product matches the selected stock filter
                let matchesStock = false;
                if (selectedStock === "All Stock") {
                    matchesStock = true;
                } else if (selectedStock === stockStatus) {
                    matchesStock = true;
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
    
        const lowStockThreshold = instockthreshold / 4; // 1/4th of instockthreshold
    
        // Check for Out of Stock (quantity is 0)
        if (quantity === 0) {
            return { text: "Out of Stock", color: "red" };
        }
        // Check for Low Stock (greater than 0 but less than or equal to 1/4 of instockthreshold)
        if (quantity > 0 && quantity <= lowStockThreshold) {
            return { text: "Low Stock", color: "orange" };
        }
        // Check for High Stock (greater than instockthreshold)
        if (quantity > instockthreshold) {
            return { text: "High Stock", color: "blue" };
        }
        // Check for In Stock (greater than lowStockThreshold but less than or equal to instockthreshold)
        if (quantity > lowStockThreshold && quantity <= instockthreshold) {
            return { text: "In Stock", color: "green" };
        }
    };
    


    return (
        <>
            <Row className="my-4">
                <div className={Productcss.containerTop}>
                    <div>
                        <SetTax />
                    </div>
                    <div>
                        <SetCategory />
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
                            {categories.map((category) => (
                                <Dropdown.Item eventKey={category.id} key={category.id}>
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
