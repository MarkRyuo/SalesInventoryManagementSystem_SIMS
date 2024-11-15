import { useState, useEffect } from "react";
import { Button, Form, Modal, InputGroup, ListGroup, Card } from "react-bootstrap";
import { addNewDiscount, fetchAllDiscounts } from "../../../services/ProductService"; // Import the necessary function
import SetDiscountsscss from './SCSS/Sets.module.scss' ;
import { MdDiscount } from "react-icons/md";

function SetDiscounts() {
    const [showModal, setShowModal] = useState(false);
    const [discountName, setDiscountName] = useState("");
    const [discountValue, setDiscountValue] = useState("");
    const [discounts, setDiscounts] = useState([]); // State to hold the list of discounts

    useEffect(() => {
        // Fetch the discounts when the component mounts
        const fetchDiscounts = async () => {
            try {
                const fetchedDiscounts = await fetchAllDiscounts(); // Fetch the discounts
                setDiscounts(fetchedDiscounts);
            } catch (error) {
                console.error("Error fetching discounts:", error.message);
            }
        };

        fetchDiscounts();
    }, []); // Empty dependency array to run this effect once on mount

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

            // After successfully adding a new discount, refetch the discount list
            const fetchedDiscounts = await fetchAllDiscounts();
            setDiscounts(fetchedDiscounts);

            handleCloseModal();
        } catch (error) {
            alert(`Error creating discount: ${error.message}`);
        }
    };

    return (
        <>
            <Button variant="success" onClick={handleShowModal} className={SetDiscountsscss.SetDiscountsBtn}>
                <MdDiscount size={15} className="me-1"/>Set Discount
            </Button>

            <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <p className="fs-4 fw-medium m-0"> <MdDiscount />Create Discount</p>
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
                                    type="text"
                                    placeholder="Enter percentage (1 - 100)"
                                    value={discountValue}
                                    onChange={(e) => setDiscountValue(e.target.value)}
                                    min={1}
                                    max={100}
                                />
                            </InputGroup>
                        </Form.Group>
                    </Form>

                    {/* Display the list of added discounts */}
                    <div className="mt-4">
                        <p className="fs-5 m-0">Existing Discounts</p>
                        {discounts.length > 0 ? (
                            <ListGroup>
                                {discounts.map((discount, index) => (
                                    <ListGroup.Item key={index}>
                                        <Card>
                                            <Card.Body>
                                                <Card.Title>{discount.name}</Card.Title>
                                                <Card.Text>
                                                    <strong>{discount.value}%</strong>
                                                </Card.Text>
                                            </Card.Body>
                                        </Card>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        ) : (
                            <p>No discounts available.</p>
                        )}
                    </div>
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
