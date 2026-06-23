import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Login from "./Login";
import Signup from "./Signup";

export default function AuthPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const isSignup = location.pathname === "/signup";

  if (loading) {
    return (
      <div style={{ color: "#00C9B1", textAlign: "center", paddingTop: "40vh" }}>
        Loading…
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="auth-root">
      <div className="auth-bg" />
      {isSignup ? (
        <Signup onSwitch={() => navigate("/login")} />
      ) : (
        <Login onSwitch={() => navigate("/signup")} />
      )}
    </div>
  );
}
