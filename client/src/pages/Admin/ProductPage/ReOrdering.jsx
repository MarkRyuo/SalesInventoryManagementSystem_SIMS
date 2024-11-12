import { useEffect, useState } from "react";
import { fetchReorderingProducts } from "../../../services/ProductService";
import { Table, Spinner, Button, Row, Col, Badge, Container } from "react-bootstrap";

function ReOrdering() {
    const [reorderingProducts, setReorderingProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const products = await fetchReorderingProducts();
                setReorderingProducts(products);
            } catch (error) {
                console.error("Error fetching reordering products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
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
                                        const statusBadge = isOutOfStock ? (
                                            <Badge bg="danger">Out of Stock</Badge>
                                        ) : (
                                            <Badge bg="warning">Low Stock</Badge>
                                        );

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
