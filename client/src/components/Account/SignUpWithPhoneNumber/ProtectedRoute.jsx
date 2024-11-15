import { Navigate } from "react-router-dom";
import { useUserAuth } from "./UserAuthContext";
// eslint-disable-next-line react/prop-types
const ProtectedRoute = ({ children }) => {
    const { user } = useUserAuth();
    if (!user) {
        return <Navigate to="/MyProfile" />;
    }
    return children;
};

export default ProtectedRoute;