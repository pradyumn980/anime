// src/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "./lib/AuthContext";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}
