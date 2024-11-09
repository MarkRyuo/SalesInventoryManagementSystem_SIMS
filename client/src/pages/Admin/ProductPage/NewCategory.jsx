import { useState } from "react";
import { Button, Form, Modal, ListGroup } from "react-bootstrap";

function NewCategory() {
    const [showModal, setShowModal] = useState(false);
    const [categoryName, setCategoryName] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState("");
    const [categories, setCategories] = useState([]); // To store added categories

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

        // Add the new category to the list
        const newCategory = { name: categoryName, description };
        setCategories([...categories, newCategory]);

        // Clear form and close modal
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

                        {/* Category List inside the modal */}
                        <div className="mt-4">
                            <h5>Existing Categories</h5>
                            {categories.length === 0 ? (
                                <p>No categories added yet.</p>
                            ) : (
                                <ListGroup>
                                    {categories.map((category, index) => (
                                        <ListGroup.Item key={index}>
                                            <strong>{category.name}</strong>
                                            {category.description && (
                                                <p className="mb-0 text-muted">
                                                    {category.description}
                                                </p>
                                            )}
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            )}
                        </div>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
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
