import { useState, useEffect } from "react";
import { Button, Form, Modal, ListGroup } from "react-bootstrap";
import { addCategory, getCategories } from '../../../services/ProductService'; // Import the Firebase functions

function NewCategory() {
    const [showModal, setShowModal] = useState(false);
    const [categoryName, setCategoryName] = useState("");
    const [error, setError] = useState("");
    const [categories, setCategories] = useState([]); // To store added categories

    // Fetch categories from Firebase when the component mounts
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const categoriesFromFirebase = await getCategories();
                setCategories(categoriesFromFirebase);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchCategories();
    }, []); // Empty dependency array to run only once when the component mounts

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => {
        setShowModal(false);
        setCategoryName(""); // Reset the fields
    };

    const handleSubmit = async () => {
        // Basic validation
        if (!categoryName.trim()) {
            setError("Category name is required.");
            return;
        }
        setError("");

        // Add the new category to Firebase
        try {
            await addCategory(categoryName); // Add category to Firebase
            setCategories(prevCategories => [...prevCategories, categoryName]); // Update state with new category
            handleCloseModal(); // Close modal after submission
        } catch (error) {
            console.error("Error adding category:", error);
            setError("Failed to add category.");
        }
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
                                            <strong>{category}</strong>
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
