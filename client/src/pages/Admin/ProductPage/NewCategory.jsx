/* eslint-disable react/prop-types */
import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";

function NewCategory({ show, handleClose, handleAddCategory }) {
        const [categoryName, setCategoryName] = useState("");
        const [description, setDescription] = useState("");
        const [error, setError] = useState("");

    const handleSubmit = () => {
    // Basic validation
    if (!categoryName.trim()) {
            setError("Category name is required.");
        return;
    }
        setError("");

        // Passing the new category data to parent component
        handleAddCategory({name: categoryName, description });

        // Reset form fields
        setCategoryName("");
        setDescription("");
        handleClose();
    };
    return (
        <div>
            <Modal show={show} onHide={handleClose} centered>
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
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                        Add Category
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default NewCategory ;
