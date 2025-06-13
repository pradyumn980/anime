import { Navigate } from "react-router-dom";
import { useAuth } from "./lib/AuthContext";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div className="text-center mt-10 text-xl">Loading...</div>;

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}
