import { Navigate, useLocation } from "react-router-dom";

/**
 * ProtectedRoute — client-side auth guard.
 * Checks for an admin JWT token in localStorage before allowing access.
 * Note: The REAL security is on the server (requireAdmin middleware).
 * This is a UX convenience to redirect unauthenticated users to login.
 */
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const location = useLocation();
    const token = localStorage.getItem("adminToken");

    if (!token) {
        // Redirect to login, preserving the intended destination
        return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
