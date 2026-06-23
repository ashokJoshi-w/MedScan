import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ color: "#00C9B1", textAlign: "center", paddingTop: "40vh" }}>Loading…</div>;
  return user ? children : <Navigate to="/login" replace />;
}
