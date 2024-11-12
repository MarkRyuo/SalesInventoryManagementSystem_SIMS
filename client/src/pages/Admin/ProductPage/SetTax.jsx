import { useState } from "react";
import { Button, Form, Modal, InputGroup } from "react-bootstrap";
import { addNewTax } from "../../../services/ProductService"; // Import your tax service function

function SetTax() {
    const [showModal, setShowModal] = useState(false);
    const [taxName, setTaxName] = useState("");
    const [taxValue, setTaxValue] = useState("");

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => {
        setShowModal(false);
        setTaxName("");
        setTaxValue("");
    };

    // Function to handle creating and saving a tax
    const handleCreateTax = async () => {
        if (!taxName || taxValue <= 0 || taxValue > 100) {
            alert("Please enter valid tax details");
            return;
        }

        try {
            await addNewTax({
                taxName,
                taxValue: parseFloat(taxValue), // Ensure numeric value
            });

            console.log("Tax created successfully");
            handleCloseModal();
        } catch (error) {
            alert(`Error creating tax: ${error.message}`);
        }
    };

    return (
        <>
            <Button variant="primary" onClick={handleShowModal}>
                Set Tax
            </Button>

            <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Create Tax Percentage</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="taxName">
                            <Form.Label>Tax Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter tax name"
                                value={taxName}
                                onChange={(e) => setTaxName(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group controlId="taxValue" className="mt-3">
                            <Form.Label>Tax Percentage</Form.Label>
                            <InputGroup>
                                <InputGroup.Text>%</InputGroup.Text>
                                <Form.Control
                                    type="number"
                                    placeholder="Enter percentage (1 - 100)"
                                    value={taxValue}
                                    onChange={(e) => setTaxValue(e.target.value)}
                                    min={1}
                                    max={100}
                                />
                            </InputGroup>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleCreateTax}
                        disabled={!taxName || !taxValue || taxValue <= 0 || taxValue > 100}
                    >
                        Create Tax
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default SetTax;
