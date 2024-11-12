import { useEffect, useState } from "react";
import { fetchReorderingProducts } from "../../../services/ProductService";
import { Table, Spinner, Button, Badge, Container } from "react-bootstrap";

function ReOrdering() {
    const [reorderingProducts, setReorderingProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Interval time para sa live update (in milliseconds)
    const POLL_INTERVAL = 10000; // Every 10 seconds

    // Function to fetch low stock and out of stock products
    const fetchData = async () => {
        try {
            const products = await fetchReorderingProducts();
            setReorderingProducts(products);
        } catch (error) {
            console.error("Error fetching reordering products:", error);
        }
    };

    useEffect(() => {
        setLoading(true);
        fetchData().then(() => setLoading(false));

        // Setup polling interval
        const intervalId = setInterval(fetchData, POLL_INTERVAL);

        // Cleanup interval on component unmount
        return () => clearInterval(intervalId);
    }, []);

    return (
        <Container>
            <h4 className="my-4">Reordering Dashboard</h4>
            {loading ? (
                <Spinner animation="border" variant="primary" />
            ) : (
                <div>
                    {reorderingProducts.length > 0 ? (
                        <>
                            <Table responsive bordered hover className="mt-3">
                                <thead className="table-primary">
                                    <tr>
                                        <th>Product Name</th>
                                        <th>SKU</th>
                                        <th>Category</th>
                                        <th>Quantity</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reorderingProducts.map((product) => {
                                        const isOutOfStock = product.quantity === 0;
                                        const isLowStock =
                                            product.quantity > 0 &&
                                            product.quantity <= product.instockthreshold / 4;

                                        const statusBadge = isOutOfStock ? (
                                            <Badge bg="danger">Out of Stock</Badge>
                                        ) : (
                                            isLowStock && <Badge bg="warning">Low Stock</Badge>
                                        );

                                        // Only display products that are low stock or out of stock
                                        if (!isOutOfStock && !isLowStock) return null;

                                        return (
                                            <tr key={product.barcode}>
                                                <td>{product.productName}</td>
                                                <td>{product.sku}</td>
                                                <td>{product.category}</td>
                                                <td>{product.quantity}</td>
                                                <td>{statusBadge}</td>
                                                <td>
                                                    <Button variant="outline-success" size="sm">
                                                        Reorder
                                                    </Button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </Table>
                        </>
                    ) : (
                        <p className="text-muted">No products need reordering.</p>
                    )}
                </div>
            )}
        </Container>
    );
}

export default ReOrdering;
