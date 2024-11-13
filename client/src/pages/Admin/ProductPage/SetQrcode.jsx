import { useState } from 'react';
import AddQrcode from "./AddQrcode";
import { Button } from 'react-bootstrap';

function SetQrcode() {
    const [showModal, setShowModal] = useState(false);

    // Handle opening the modal
    const handleShowModal = () => setShowModal(true);

    // Handle closing the modal
    const handleCloseModal = () => setShowModal(false);

    return (
        <>
            <div>
                <Button variant="primary" onClick={handleShowModal}>
                    Set QR Code for Product
                </Button>
                <AddQrcode
                    showModal={showModal}
                    handleCloseModal={handleCloseModal}
                />
            </div>
        </>
    );
}

export default SetQrcode;
