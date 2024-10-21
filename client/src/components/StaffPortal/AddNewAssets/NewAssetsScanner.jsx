/* eslint-disable react/prop-types */

import { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';

const NewAssetsScanner = ({ onDetected }) => {
    const scannerRef = useRef(null);
    const [detectedCode, setDetectedCode] = useState(null);
    const [error, setError] = useState('');
    const codeReaderRef = useRef(new BrowserMultiFormatReader());

    useEffect(() => {
        // Function to start scanning
        const startScanner = async () => {
            try {
                const videoInputDevices = await codeReaderRef.current.listVideoInputDevices();
                const selectedDeviceId = videoInputDevices[0]?.deviceId; // Get the first available camera

                if (!selectedDeviceId) {
                    setError('No camera found. Please connect a camera.');
                    return;
                }

                // Start scanning from the video device
                codeReaderRef.current.decodeFromVideoDevice(
                    selectedDeviceId,
                    scannerRef.current,
                    (result, err) => {
                        if (result) {
                            const code = result.getText();
                            setDetectedCode(code);
                            onDetected(code);
                            codeReaderRef.current.reset(); // Stop scanning after detecting a code
                        }
                        if (err) {
                            console.error('Scanning error:', err);
                        }
                    }
                ).catch((err) => {
                    console.error('Error during decoding:', err);
                });
            } catch (error) {
                console.error('Error initializing ZXing scanner:', error);
                setError('Error initializing scanner. Please check your camera.');
            }
        };

        startScanner();

        // Cleanup when the component is unmounted
        return () => {
            codeReaderRef.current.reset();
        };
    }, [onDetected]);

    return (
        <div>
            <video ref={scannerRef} style={{ width: '400px', height: '300px' }} />
            <p>Point the camera at a barcode or QR code to scan.</p>
            {detectedCode && <p>Detected Code: {detectedCode}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default NewAssetsScanner;
