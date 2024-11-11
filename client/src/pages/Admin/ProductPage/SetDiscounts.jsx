import { useState } from "react";
import { Button, Form, Modal, InputGroup } from "react-bootstrap";

function SetDiscounts() {
    const [showModal, setShowModal] = useState(false);
    const [discountName, setDiscountName] = useState("");
    const [discountValue, setDiscountValue] = useState("");

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => {
        setShowModal(false);
        // Reset fields on close
        setDiscountName("");
        setDiscountValue("");
    };

    const handleCreateDiscount = () => {
        // Add validation and submit logic here
        console.log({
            discountName,
            discountValue: `${discountValue}%` // Format as a percentage
        });
        handleCloseModal();
    };

    return (
        <>
            <Button variant="primary" onClick={handleShowModal}>
                Set Discount
            </Button>

            {/* Modal for Creating Percentage Discount */}
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
