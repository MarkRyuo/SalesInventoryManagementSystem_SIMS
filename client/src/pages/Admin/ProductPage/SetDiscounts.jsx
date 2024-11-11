import { useState } from "react";
import { Button, Form, Modal, InputGroup } from "react-bootstrap";
import { addNewDiscount } from "../../../services/ProductService"; // Import the new function

function SetDiscounts() {
    const [showModal, setShowModal] = useState(false);
    const [discountName, setDiscountName] = useState("");
    const [discountValue, setDiscountValue] = useState("");

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => {
        setShowModal(false);
        setDiscountName("");
        setDiscountValue("");
    };

    // Function to handle creating and saving a discount
    const handleCreateDiscount = async () => {
        if (!discountName || discountValue <= 0 || discountValue > 100) {
            alert("Please enter valid discount details");
            return;
        }

        try {
            await addNewDiscount({
                discountName,
                discountValue: parseFloat(discountValue), // Ensure numeric value
            });

            console.log("Discount created successfully");
            handleCloseModal();
        } catch (error) {
            alert(`Error creating discount: ${error.message}`);
        }
    };

    return (
        <>
            <Button variant="success" onClick={handleShowModal}>
                Set Discount
            </Button>

            <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Create Percentage Discount</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="discountName">
                            <Form.Label>Discount Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter discount name"
                                value={discountName}
                                onChange={(e) => setDiscountName(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group controlId="discountValue" className="mt-3">
                            <Form.Label>Discount Percentage</Form.Label>
                            <InputGroup>
                                <InputGroup.Text>%</InputGroup.Text>
                                <Form.Control
                                    type="number"
                                    placeholder="Enter percentage (1 - 100)"
                                    value={discountValue}
                                    onChange={(e) => setDiscountValue(e.target.value)}
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
                        variant="success"
                        onClick={handleCreateDiscount}
                        disabled={!discountName || !discountValue || discountValue <= 0 || discountValue > 100}
                    >
                        Create Discount
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default SetDiscounts;
