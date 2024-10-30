import { useRef, useState, useEffect } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';

function PosScanner() {
    const videoRef = useRef(null);
    const [scannedItems, setScannedItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const codeReader = new BrowserMultiFormatReader();

        const startScanning = async () => {
            try {
                setLoading(true);
                const result = await codeReader.decodeFromVideoDevice(null, videoRef.current, (result, err) => {
                    if (result) {
                        setScannedItems((prevItems) => [...prevItems, result.text]);
                        setError('');
                    }
                    if (err && !(err instanceof Error)) {
                        setError(err);
                    }
                });
                console.log(result); // You can log the result for debugging
            } catch (e) {
                console.error('Error starting scanner:', e);
                setError('Error starting scanner');
            } finally {
                setLoading(false);
            }
        };

        startScanning();

        // Cleanup function to stop scanning
        return () => {
            codeReader.reset();
        };
    }, []);

    return (
        <div>
            <h1>POS Scanner</h1>
            <video ref={videoRef} style={{ width: '300px', height: 'auto' }} autoPlay />
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div>
                <h2>Scanned Items</h2>
                <ul>
                    {scannedItems.map((item, index) => (
                        <li key={index}>{item}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default PosScanner;
