import { useState, useEffect } from "react";
import { Button, Form, Modal, InputGroup, ListGroup, Card } from "react-bootstrap";
import { addNewTax, fetchAllTaxes } from "../../../services/ProductService"; // Import correct function
import SetTaxscss from './SCSS/SetTax.module.scss' ;
function SetTax() {
    const [showModal, setShowModal] = useState(false);
    const [taxName, setTaxName] = useState("");
    const [taxValue, setTaxValue] = useState("");
    const [taxes, setTaxes] = useState([]); // State to hold the list of taxes

    useEffect(() => {
        const fetchTaxes = async () => {
            try {
                const fetchedTaxes = await fetchAllTaxes();
                setTaxes(fetchedTaxes);  // Ensure this is updating the state correctly
            } catch (error) {
                console.error("Error fetching taxes:", error.message);
            }
        };

        fetchTaxes();
    }, []);


    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => {
        setShowModal(false);
        setTaxName("");
        setTaxValue("");
    };

    // Function to handle creating and saving a tax
    const handleCreateTax = async () => {
        console.log("Creating tax with:", taxName, taxValue);
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

            // After successfully adding a new tax, refetch the tax list
            const fetchedTaxes = await fetchAllTaxes();
            setTaxes(fetchedTaxes);

            handleCloseModal();
        } catch (error) {
            alert(`Error creating tax: ${error.message}`);
        }
    };


    return (
        <>
            <Button variant="primary" onClick={handleShowModal} className={SetTaxscss.SetTaxBtn}>
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
                                    type="text"
                                    placeholder="Enter percentage (1 - 100)"
                                    value={taxValue}
                                    onChange={(e) => setTaxValue(e.target.value)}
                                    min={1}
                                    max={100}
                                />
                            </InputGroup>
                        </Form.Group>
                    </Form>

                    {/* Display the list of added taxes */}
                    <div>
                        <p className="fs-5 mt-2">Existing Taxes</p>
                        {taxes.length > 0 ? (
                            <ListGroup>
                                {taxes.map((tax, index) => (
                                    <ListGroup.Item key={index}>
                                        <Card>
                                            <Card.Body className={SetTaxscss.cardBody}>
                                                <p className="fs-6 me-1 m-0">{tax.name}: </p> {/* Ensure this matches your Firebase structure */}
                                                <p className="m-0 p-0 fw-medium">{tax.value}%</p> {/* Ensure this matches your Firebase structure */}
                                            </Card.Body>
                                        </Card>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        ) : (
                            <p>No taxes available.</p>
                        )}
                    </div>

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
