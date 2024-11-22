import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // useNavigate for redirection
import { db } from '../services/firebase'; // Firebase configuration
import { query, where, getDocs, collection, doc, updateDoc } from 'firebase/firestore';

const VerifyEmail = () => {
    const { token } = useParams(); // Get the verification token from the URL
    const navigate = useNavigate(); // For navigation after email verification

    useEffect(() => {
        const verifyToken = async () => {
            try {
                // Query Firestore for the admin document with the matching verification code
                const adminsCollection = collection(db, 'admins');
                const adminQuery = query(adminsCollection, where('verification_code', '==', token));
                const adminSnapshot = await getDocs(adminQuery);

                if (!adminSnapshot.empty) {
                    const adminDoc = adminSnapshot.docs[0];
                    const adminId = adminDoc.id;

                    // Update the email_verified field to true
                    await updateDoc(doc(db, 'admins', adminId), {
                        email_verified: true,
                    });

                    alert('Email verified successfully!');
                    navigate('/login'); // Redirect to login page after successful verification
                } else {
                    alert('Invalid or expired verification token.');
                }
            } catch (error) {
                console.error('Error verifying token: ', error);
            }
        };

        verifyToken();
    }, [token, navigate]); // Include navigate in the dependency array

    return <div>Verifying your email...</div>;
};

export default VerifyEmail;
