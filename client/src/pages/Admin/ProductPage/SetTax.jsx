import { useState, useEffect } from "react";
import { Modal, Button, Form, ListGroup } from "react-bootstrap";
import { setGlobalTaxRate, fetchGlobalTaxRates, deleteTaxRate } from "../../../services/ProductService"; // Assuming these functions are in the ProductService

function SetTax() {
    const [showModal, setShowModal] = useState(false);
    const [taxRate, setTaxRate] = useState("");
    const [taxRates, setTaxRates] = useState([]); // To hold the list of tax rates

    // Toggle the modal visibility
    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    // Handle tax rate change
    const handleTaxChange = (e) => setTaxRate(e.target.value);

    // Handle form submission to set global tax rate
    const handleSubmit = async () => {
        try {
            await setGlobalTaxRate(taxRate); // Save global tax rate to Firebase
            console.log("Global tax rate set to:", taxRate);
            fetchTaxRates(); // Refresh the list of tax rates after setting the new one
            handleCloseModal(); // Close modal after setting the tax
        } catch (error) {
            console.error("Error setting global tax rate:", error.message);
        }
    };

    // Fetch all global tax rates from Firebase
    const fetchTaxRates = async () => {
        try {
            const rates = await fetchGlobalTaxRates(); // Fetch tax rates from your service
            setTaxRates(rates); // Update state with the fetched tax rates
        } catch (error) {
            console.error("Error fetching tax rates:", error.message);
        }
    };

    // Delete a tax rate
    const handleDeleteTaxRate = async (id) => {
        try {
            await deleteTaxRate(id); // Delete the tax rate by its ID
            fetchTaxRates(); // Refresh the list after deletion
            console.log("Tax rate deleted:", id);
        } catch (error) {
            console.error("Error deleting tax rate:", error.message);
        }
    };

    // Fetch the tax rates when the component mounts
    useEffect(() => {
        fetchTaxRates();
    }, []);

    return (
        <>
            <Button variant="primary" onClick={handleShowModal}>
                Set Tax Rate
            </Button>

            {/* Modal for setting tax */}
            <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Set Tax Rate</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formTaxRate">
                            <Form.Label>Tax Rate (%)</Form.Label>
                            <Form.Control
                                type="number"
                                value={taxRate}
                                onChange={handleTaxChange}
                                placeholder="Enter tax rate"
                                min="0"
                                max="100"
                            />
                        </Form.Group>
                    </Form>
                    <h5>Tax Rates Set:</h5>
                    {/* Display list of previously set tax rates */}
                    <ListGroup>
                        {taxRates.length === 0 ? (
                            <ListGroup.Item>No tax rates set yet.</ListGroup.Item>
                        ) : (
                            taxRates.map((rate) => (
                                <ListGroup.Item key={rate.id}>
                                    {rate.rate}%
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        className="float-end"
                                        onClick={() => handleDeleteTaxRate(rate.id)}>
                                        Delete
                                    </Button>
                                </ListGroup.Item>
                            ))
                        )}
                    </ListGroup>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                        Set Tax
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default SetTax;
