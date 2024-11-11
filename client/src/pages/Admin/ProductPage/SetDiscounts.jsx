import { useState } from "react";
import { Button, Form, Modal, InputGroup } from "react-bootstrap";

function SetDiscounts() {
    const [showModal, setShowModal] = useState(false);
    const [discountName, setDiscountName] = useState("");
    const [discountType, setDiscountType] = useState("percentage"); // Default to percentage
    const [discountValue, setDiscountValue] = useState("");

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => {
        setShowModal(false);
        // Reset fields on close
        setDiscountName("");
        setDiscountType("percentage");
        setDiscountValue("");
    };

    const handleCreateDiscount = () => {
        // Add validation and submit logic here
        console.log({
            discountName,
            discountType,
            discountValue
        });
        handleCloseModal();
    };

    return (
        <>
            <Button variant="primary" onClick={handleShowModal}>
                Create New Discount
            </Button>

            {/* Modal for Creating Discount */}
            <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Create Discount</Modal.Title>
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

                        <Form.Group controlId="discountType" className="mt-3">
                            <Form.Label>Discount Type</Form.Label>
                            <Form.Select
                                value={discountType}
                                onChange={(e) => setDiscountType(e.target.value)}
                            >
                                <option value="percentage">Percentage (%)</option>
                                <option value="fixed">Fixed Amount</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group controlId="discountValue" className="mt-3">
                            <Form.Label>Discount Value</Form.Label>
                            <InputGroup>
                                {discountType === "percentage" && (
                                    <InputGroup.Text>%</InputGroup.Text>
                                )}
                                {discountType === "fixed" && (
                                    <InputGroup.Text>₱</InputGroup.Text>
                                )}
                                <Form.Control
                                    type="number"
                                    placeholder="Enter value"
                                    value={discountValue}
                                    onChange={(e) => setDiscountValue(e.target.value)}
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
                        disabled={!discountName || !discountValue}
                    >
                        Create Discount
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default SetDiscounts;
