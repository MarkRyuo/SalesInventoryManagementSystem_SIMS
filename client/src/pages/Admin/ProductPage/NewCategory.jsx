import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";

function NewCategory() {
    const [showModal, setShowModal] = useState(false);
    const [categoryName, setCategoryName] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState("");

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => {
        setShowModal(false);
        setCategoryName(""); // Reset the fields
        setDescription(""); // Reset the fields
    };

    const handleSubmit = () => {
        // Basic validation
        if (!categoryName.trim()) {
            setError("Category name is required.");
            return;
        }
        setError("");

        // Passing the new category data to parent component or to wherever you want to save
        console.log("New Category Added:", { name: categoryName, description });

        // Close the modal and reset the form fields
        handleCloseModal();
    };

    return (
        <div className="text-center mt-3">
            {/* Button to show the modal */}
            <Button variant="success" onClick={handleShowModal}>
                Add New Category
            </Button>

            {/* Modal for adding a new category */}
            <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Category</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="categoryName">
                            <Form.Label>Category Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter category name"
                                value={categoryName}
                                onChange={(e) => setCategoryName(e.target.value)}
                                isInvalid={!!error}
                            />
                            <Form.Control.Feedback type="invalid">
                                {error}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="categoryDescription" className="mt-3">
                            <Form.Label>Description (Optional)</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Enter category description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                        Add Category
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default NewCategory;
