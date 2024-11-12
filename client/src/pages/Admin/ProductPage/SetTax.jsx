import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

function SetTax() {
    const [showModal, setShowModal] = useState(false);
    const [taxRate, setTaxRate] = useState("");

    // Toggle the modal visibility
    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    // Handle tax rate change
    const handleTaxChange = (e) => setTaxRate(e.target.value);

    // Handle form submission
    const handleSubmit = () => {
        // Here you would save the tax rate to the backend or update state
        console.log("Tax rate set to:", taxRate);
        handleCloseModal(); // Close modal after setting the tax
    };

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
