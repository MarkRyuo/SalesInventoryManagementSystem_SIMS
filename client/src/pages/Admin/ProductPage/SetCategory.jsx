import { useState, useEffect } from "react";
import { Button, Form, Modal, ListGroup, Spinner, Alert } from "react-bootstrap";
import { addCategory, getCategories, deleteCategory, updateCategory } from "../../../services/ProductService";
import SetCategoryscss from "./SCSS/Sets.module.scss";
import { MdCategory } from "react-icons/md";
import { FaPen } from "react-icons/fa";
import { FaRegTrashAlt } from "react-icons/fa";

function SetCategory() {
    const [showModal, setShowModal] = useState(false);
    const [categoryName, setCategoryName] = useState("");
    const [error, setError] = useState("");
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    // New state for delete confirmation modal
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);

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
    }, []);

    const handleShowModal = () => {
        setShowModal(true);
        setSuccess(false);
        setEditingCategory(null);
    };

    const handleCloseModal = () => {
        if (editingCategory) {
            setCategoryName("");
            setEditingCategory(null);
            setError("");
            setSuccess(false);
        } else {
            setShowModal(false);
            setCategoryName("");
            setError("");
            setSuccess(false);
        }
    };

    const handleSubmit = async () => {
        if (!categoryName.trim()) {
            setError("Category name is required.");
            return;
        }
        setError("");

        if (editingCategory) {
            try {
                setLoading(true);
                await updateCategory(editingCategory.id, { name: categoryName });
                setCategories((prevCategories) =>
                    prevCategories.map((cat) =>
                        cat.id === editingCategory.id ? { ...cat, name: categoryName } : cat
                    )
                );
                setSuccess(true);
                setTimeout(() => setSuccess(false), 2000);
                setLoading(false);
                setCategoryName("");
                setEditingCategory(null);
            } catch (error) {
                console.error("Error updating category:", error);
                setError("Failed to update category.");
                setLoading(false);
            }
        } else {
            try {
                setLoading(true);
                await addCategory(categoryName);
                setCategories((prevCategories) => [
                    ...prevCategories,
                    { id: Date.now(), name: categoryName },
                ]);
                setSuccess(true);
                setTimeout(() => setSuccess(false), 2000);
                setLoading(false);
                setCategoryName("");
            } catch (error) {
                console.error("Error adding category:", error);
                setError("Failed to add category.");
                setLoading(false);
            }
        }
    };

    const handleDeleteConfirmation = (category) => {
        setCategoryToDelete(category);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!categoryToDelete) return;
        try {
            await deleteCategory(categoryToDelete.id);
            setCategories((prevCategories) =>
                prevCategories.filter((cat) => cat.id !== categoryToDelete.id)
            );
            setShowDeleteModal(false);
            setCategoryToDelete(null);
        } catch (error) {
            console.error("Error deleting category:", error);
            setError("Failed to delete category.");
        }
    };

    const handleCancelDelete = () => {
        setShowDeleteModal(false);
        setCategoryToDelete(null);
    };

    const handleEdit = (category) => {
        setEditingCategory(category);
        setCategoryName(category.name);
        setShowModal(true);
    };

    return (
        <div className="text-center">
            <Button
                variant="success"
                onClick={handleShowModal}
                className={SetCategoryscss.SetCategoryBtn}
            >
                <MdCategory size={15} className="me-1" />
                Set Category
            </Button>

            {/* Add/Edit Category Modal */}
            <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <p className="fs-4 fw-medium m-0">
                        {editingCategory ? "Edit Category" : "Add Category"}
                    </p>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="categoryName">
                            <Form.Label className="m-1">Category Name</Form.Label>
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

                        {/* Success Message */}
                        {success && (
                            <Alert variant="success" className="mt-3">
                                Category {editingCategory ? "updated" : "added"} successfully!
                            </Alert>
                        )}

                        {/* List of Categories */}
                        <div className="mt-4">
                            <p className="fs-5 m-1">Existing Categories</p>
                            {categories.length === 0 ? (
                                <p>No categories added yet.</p>
                            ) : (
                                <ListGroup className={SetCategoryscss.listGroupofCategory}>
                                    {categories.map((category) => (
                                        <ListGroup.Item
                                            key={category.id}
                                            className={SetCategoryscss.listItmeofCategory}
                                        >
                                            <p className="fs-6 fw-medium m-0 p-2">{category.name}</p>
                                            <div>
                                                <Button
                                                    variant="outline-info"
                                                    size="sm"
                                                    className="me-2 m-0 px-3"
                                                    onClick={() => handleEdit(category)}
                                                >
                                                    <FaPen />
                                                </Button>
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    className="m-0 px-3"
                                                    onClick={() => handleDeleteConfirmation(category)}
                                                >
                                                    <FaRegTrashAlt />
                                                </Button>
                                            </div>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            )}
                        </div>

                        {loading && (
                            <div className="text-center mt-3">
                                <Spinner animation="border" variant="primary" />
                            </div>
                        )}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        {editingCategory ? "Cancel" : "Close"}
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleSubmit}
                        disabled={loading || !categoryName.trim()}
                    >
                        {loading
                            ? "Processing..."
                            : editingCategory
                                ? "Save Changes"
                                : "Add Category"}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteModal} onHide={handleCancelDelete} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>
                        Are you sure you want to delete the category{" "}
                        <strong>{categoryToDelete?.name}</strong>?
                    </p>
                    <p className="text-danger fw-bold">
                        This action cannot be undone, and the category cannot be restored.
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCancelDelete}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={confirmDelete}>
                        Yes, Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default SetCategory;
