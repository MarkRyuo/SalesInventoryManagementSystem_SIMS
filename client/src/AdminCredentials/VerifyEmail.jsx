import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from './firebase'; // Firebase configuration
import { doc, updateDoc } from 'firebase/firestore';

const VerifyEmail = () => {
    const { token } = useParams(); // Get the verification token from the URL

    useEffect(() => {
        // Call the backend to verify the token
        const verifyToken = async () => {
            try {
                const adminRef = await db.collection('admins').where('verification_code', '==', token).get();

                if (!adminRef.empty) {
                    const adminDoc = adminRef.docs[0];
                    const adminId = adminDoc.id;

                    // Update the email_verified field to true
                    await updateDoc(doc(db, 'admins', adminId), {
                        email_verified: true,
                    });

                    alert('Email verified successfully!');
                } else {
                    alert('Invalid or expired verification token.');
                }
            } catch (error) {
                console.error('Error verifying token: ', error);
            }
        };

        verifyToken();
    }, [token]);

    return <div>Verifying your email...</div>;
};

export default VerifyEmail;
