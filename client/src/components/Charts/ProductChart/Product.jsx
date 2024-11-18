import { Row, Col, Form, Dropdown, DropdownButton, Spinner, Modal, Button, Container } from "react-bootstrap";
import Productcss from './Product.module.scss';
import { useEffect, useState } from "react";
import { getAllProducts, getCategories } from "../../../services/ProductService";
import SetCategory from "../../../pages/Admin/ProductPage/SetCategory";
import SetDiscounts from "../../../pages/Admin/ProductPage/SetDiscounts";
import SetTax from "../../../pages/Admin/ProductPage/SetTax";
import { LuFileEdit } from "react-icons/lu";
import { editProductInDatabase, deleteProduct } from '../../../services/ProductService';
import { FaProductHunt } from "react-icons/fa";


function ProductChart() {
    const [searchTerm, setSearchTerm] = useState("");
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("All Category");
    const [selectedStock, setSelectedStock] = useState("All Stock");
    const [loading, setLoading] = useState(true);

    const [showModal, setShowModal] = useState(false);
    const [editProduct, setEditProduct] = useState(null);
    const [showSaveConfirmation, setShowSaveConfirmation] = useState(false); // Confirmation for saving
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false); // Confirmation for deleting

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

    const openModal = (product) => {
        setEditProduct(product);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditProduct(null);
    };

    const handleModalInputChange = (key, value) => {
        setEditProduct((prev) => ({ ...prev, [key]: value }));
    };

    const confirmSaveChanges = () => {
        setShowSaveConfirmation(true);
    };


    const confirmDeleteProduct = () => {
        setShowDeleteConfirmation(true);
    };

    const saveChanges = async () => {
        try {
            console.log('Saving changes for product:', editProduct);

            // Update the product in the database (partial update)
            await editProductInDatabase(editProduct);

            // Refetch products from the database
            const allProducts = await getAllProducts();
            setProducts(Object.values(allProducts)); // Update state with fresh data
            setFilteredProducts(Object.values(allProducts));

            setShowSaveConfirmation(false);
            closeModal();
        } catch (error) {
            console.error('Error saving changes:', error.message);
        }
    };



    const handleDeleteProduct = async () => {
        try {
            if (editProduct) {
                await deleteProduct(editProduct.barcode);
                setProducts((prev) => prev.filter((product) => product.barcode !== editProduct.barcode));
                setShowDeleteConfirmation(false);
                closeModal();
            }
        } catch (error) {
            console.error('Error deleting product:', error.message);
        }
    };

    const includedFields = [
        'productName',
        'price',
        'category',
        'quantity',
        'color',
        'size',
        'wattage',
        'voltage',
        'instockthreshold',
    ];

    const sortedProducts = products.sort((a, b) => {
        const aIsUnset = !a.instockthreshold;
        const bIsUnset = !b.instockthreshold;
        if (aIsUnset && !bIsUnset) return -1;
        if (!aIsUnset && bIsUnset) return 1;
        return 0;
    });
    


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
                                placeholder= "Search Products"
                                className=""
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </Col>
                    </Form>
                </Col>
                <div style={{ display: "inline-flex", gap: 70, marginTop: 10 }}>
                    <div className={Productcss.allDropdownyBtn}>
                        <DropdownButton
                            variant=""
                            id="dropdown-basic-button"
                            title=<span>{selectedCategory}</span>
                            onSelect={(eventKey) => setSelectedCategory(eventKey)}
                        >
                            <Dropdown.Item eventKey="All Category"><span>All Category</span></Dropdown.Item>
                            {categories.map((category) => (
                                <Dropdown.Item eventKey={category.id} key={category.id}>
                                    <span>{category.name}</span>
                                </Dropdown.Item>
                            ))}
                        </DropdownButton>

                    </div>
                    <div className={Productcss.allDropdownyBtn}>
                        <DropdownButton
                            variant=""
                            id="stock-dropdown"
                            title=<span>{selectedStock}</span>
                            onSelect={(eventKey) => setSelectedStock(eventKey)}
                        >
                            <Dropdown.Item eventKey="All Stock"><span>All Stock</span></Dropdown.Item>
                            <Dropdown.Item eventKey="In Stock"><span>In Stock</span></Dropdown.Item>
                            <Dropdown.Item eventKey="Low Stock"><span>Low Stock</span></Dropdown.Item>
                            <Dropdown.Item eventKey="High Stock"><span>High Stock</span></Dropdown.Item>
                            <Dropdown.Item eventKey="Out of Stock"><span>Out of Stock</span></Dropdown.Item>
                            <Dropdown.Item eventKey="Threshold not set"><span>Threshold not set</span></Dropdown.Item>
                        </DropdownButton>
                    </div>
                </div>
            </Row>

            <div className={Productcss.containerProduct}>
                <div className={Productcss.colProduct}>
                    <div className={Productcss.productContent}>
                        {loading ? (
                            <div className="text-center">
                                <Spinner animation="border" variant="primary" />
                            </div>
                        ) : (
                            sortedProducts.filter(product => filteredProducts.includes(product)).length > 0 ? (
                                sortedProducts
                                    .filter(product => filteredProducts.includes(product))
                                    .map(product => {
                                        const { text, color } = getStockStatus(product.quantity, product.instockthreshold);
                                        return (
                                            <div key={product.barcode} className={Productcss.productCard}>
                                                <div>
                                                    <div className="d-flex">
                                                        <p className="m-0 pb-2">{product.productName}</p>
                                                        <span style={{ color: color }} className="p-0">• {text}</span>
                                                    </div>
                                                    <div className={Productcss.lastChild}>
                                                        <p className="m-0 p-0">SKU: {product.sku}</p>
                                                        <p className="m-0 p-0">Quantity: {product.quantity}</p>
                                                        <p>Price: ₱{product.price}</p>
                                                    </div>
                                                </div>
                                                <div>
                                                    <Button
                                                        variant=""
                                                        onClick={() => openModal(product)}
                                                        className="me-2"
                                                    >
                                                        <LuFileEdit size={20}/>
                                                    </Button>
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

                <Modal
                    show={showModal}
                    onHide={closeModal}
                    centered
                    backdrop="static"
                    size="lg"
                >
                    <Modal.Header closeButton>
                        <Modal.Title style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                            <FaProductHunt size={20} className="me-2"/>
                            {editProduct ? editProduct.productName : 'Edit Product'}
                            {editProduct && (
                                <>
                                    <p className='fs-6 m-0 p-0'>SKU: {editProduct.sku}</p>
                                    <p className='fs-6 m-0'>Barcode: {editProduct.barcode}</p>
                                </>
                            )}
                        </Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        {editProduct && (
                            <Form>
                                <Container>
                                    <Row style={{ height: '45vh', overflow: 'auto' }}>
                                        {includedFields.map((key) => (
                                            <Col xs={12} md={6} key={key} className="mb-3">
                                                <Form.Group controlId={`form${key}`}>
                                                    <Form.Label>
                                                        {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                                                    </Form.Label>
                                                    {key === 'category' ? (
                                                        <Form.Control
                                                            as="select"
                                                            value={editProduct[key]}
                                                            onChange={(e) => handleModalInputChange(key, e.target.value)}
                                                        >
                                                            <option value="">Select {key}</option>
                                                            {categories.map((category) => (
                                                                <option key={category.id} value={category.id}>
                                                                    {category.name}
                                                                </option>
                                                            ))}
                                                        </Form.Control>
                                                    ) : key === 'instockthreshold' ? (
                                                        <Form.Control
                                                            type="number"
                                                            value={editProduct[key]}
                                                            onChange={(e) => handleModalInputChange(key, parseFloat(e.target.value))}
                                                            placeholder="Enter stock threshold"
                                                                style={{ appearance: 'none', MozAppearance: 'textfield' }}
                                                                isInvalid={editProduct[key] === undefined || editProduct[key] === '' || editProduct[key] <= 0}
                                                        />
                                                    ) :  key === 'quantity' ? (
                                                        <Form.Control
                                                            type="text"
                                                            value={editProduct[key]}
                                                            disabled
                                                            onChange={(e) => handleModalInputChange(key, e.target.value)}
                                                        />
                                                    ): (
                                                        <Form.Control
                                                            type="text"
                                                            value={editProduct[key]}
                                                            onChange={(e) => handleModalInputChange(key, e.target.value)}
                                                        />
                                                    )}
                                                    <Form.Control.Feedback type="invalid">
                                                        Please enter a valid threshold greater than 0.
                                                    </Form.Control.Feedback>
                                                </Form.Group>
                                            </Col>
                                        ))}
                                    </Row>
                                </Container>
                            </Form>
                        )}
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={closeModal}>Cancel</Button>
                        <Button variant="danger" onClick={confirmDeleteProduct}>Delete</Button>
                        <Button variant="primary" onClick={confirmSaveChanges}>Save Changes</Button>
                    </Modal.Footer>
                </Modal>

                {/* Save Confirmation Modal */}
                <Modal
                    show={showSaveConfirmation}
                    onHide={() => setShowSaveConfirmation(false)}
                    centered
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Confirm Save</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Are you sure you want to save the changes to this product?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowSaveConfirmation(false)}>Cancel</Button>
                        <Button variant="primary" onClick={saveChanges}>Yes, Save</Button>
                    </Modal.Footer>
                </Modal>

                {/* Delete Confirmation Modal */}
                <Modal
                    show={showDeleteConfirmation}
                    onHide={() => setShowDeleteConfirmation(false)}
                    centered
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Confirm Deletion</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Are you sure you want to delete this product?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowDeleteConfirmation(false)}>Cancel</Button>
                        <Button variant="danger" onClick={handleDeleteProduct}>Yes, Delete</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </>
    );
}

export default ProductChart;
