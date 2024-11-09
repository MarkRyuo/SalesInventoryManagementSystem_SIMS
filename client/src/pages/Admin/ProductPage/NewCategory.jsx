import { useState, useEffect } from "react";
import { Button, Form, Modal, ListGroup, Spinner, Alert } from "react-bootstrap";
import { addCategory, getCategories, deleteCategory, updateCategory } from '../../../services/ProductService';

function NewCategory() {
    const [showModal, setShowModal] = useState(false);
    const [categoryName, setCategoryName] = useState("");
    const [error, setError] = useState("");
    const [categories, setCategories] = useState([]); // To store added categories
    const [loading, setLoading] = useState(false); // To track loading state
    const [success, setSuccess] = useState(false); // To track success state
    const [editingCategory, setEditingCategory] = useState(null); // For tracking category being edited

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

    const handleShowModal = () => {
        setShowModal(true);
        setSuccess(false); // Reset success message when opening the modal
        setEditingCategory(null); // Reset editing category
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setCategoryName(""); // Reset the fields
        setError("");
        setSuccess(false); // Reset success message on close
    };

    const handleSubmit = async () => {
        // Basic validation
        if (!categoryName.trim()) {
            setError("Category name is required.");
            return;
        }
        setError("");

        // If we're editing a category, update it
        if (editingCategory) {
            try {
                setLoading(true); // Start loading
                await updateCategory(editingCategory.id, { name: categoryName }); // Update category in Firebase
                setCategories(prevCategories => prevCategories.map(
                    cat => cat.id === editingCategory.id ? { ...cat, name: categoryName } : cat
                ));
                setSuccess(true); // Set success message
                setLoading(false); // End loading
                setCategoryName(""); // Reset the input field
                setEditingCategory(null); // Reset editing state
            } catch (error) {
                console.error("Error updating category:", error);
                setError("Failed to update category.");
                setLoading(false); // End loading if error occurs
            }
        } else {
            // If we're adding a new category, add it
            try {
                setLoading(true); // Start loading
                await addCategory(categoryName); // Add category to Firebase
                setCategories(prevCategories => [
                    ...prevCategories, { id: Date.now(), name: categoryName }
                ]); // Update state with new category (assuming Firebase returns an id)
                setSuccess(true); // Set success message
                setLoading(false); // End loading
                setCategoryName(""); // Reset the input field
            } catch (error) {
                console.error("Error adding category:", error);
                setError("Failed to add category.");
                setLoading(false); // End loading if error occurs
            }
        }
    };

    const handleDelete = async (category) => {
        // Delete category
        try {
            await deleteCategory(category.id); // Delete from Firebase (ensure category has an id)
            setCategories(prevCategories => prevCategories.filter(cat => cat.id !== category.id)); // Update state
        } catch (error) {
            console.error("Error deleting category:", error);
            setError("Failed to delete category.");
        }
    };

    const handleEdit = (category) => {
        // Set category to be edited
        setEditingCategory(category);
        setCategoryName(category.name); // Set category name in the input
        setShowModal(true); // Open modal to edit
    };

    return (
        <div className="text-center mt-3">
            {/* Button to show the modal */}
            <Button variant="success" onClick={handleShowModal}>
                Add New Category
            </Button>

            {/* Modal for adding or editing a category */}
            <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{editingCategory ? "Edit Category" : "Add New Category"}</Modal.Title>
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

                        {/* Show Success Message */}
                        {success && (
                            <Alert variant="success" className="mt-3">
                                Category {editingCategory ? "updated" : "added"} successfully!
                            </Alert>
                        )}

                        {/* Category List inside the modal */}
                        <div className="mt-4">
                            <h5>Existing Categories</h5>
                            {categories.length === 0 ? (
                                <p>No categories added yet.</p>
                            ) : (
                                <ListGroup>
                                    {categories.map((category) => (
                                        <ListGroup.Item key={category.id}>
                                            <strong>{category.name}</strong>
                                            <Button variant="warning" size="sm" className="ml-2" onClick={() => handleEdit(category)}>
                                                Edit
                                            </Button>
                                            <Button variant="danger" size="sm" className="ml-2" onClick={() => handleDelete(category)}>
                                                Delete
                                            </Button>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            )}
                        </div>

                        {/* Show Loading Spinner while the request is in progress */}
                        {loading && (
                            <div className="text-center mt-3">
                                <Spinner animation="border" variant="primary" />
                            </div>
                        )}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSubmit} disabled={loading}>
                        {loading ? 'Processing...' : (editingCategory ? 'Save Changes' : 'Add Category')}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default NewCategory;
