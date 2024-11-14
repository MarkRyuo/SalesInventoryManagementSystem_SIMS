import { useState } from 'react';
import { Button } from 'react-bootstrap';
import AddQrcode from './AddQrcode';

function ViewQrCode() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <div>
                <Button variant="primary" onClick={openModal}>
                    Generate QR Code
                </Button>
                <AddQrcode show={isModalOpen} onClose={closeModal} />
            </div>

            
        </>
    );
}

export default ViewQrCode;
