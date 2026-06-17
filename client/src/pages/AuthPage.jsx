import { useState } from "react";
import Login from "./Login";
import Signup from "./Signup";
import "./Auth.css";

export default function AuthPage() {
  const [view, setView] = useState("login");
  return (
    <div className="auth-root">
      <div className="auth-bg" />
      {view === "login"
        ? <Login onSwitch={() => setView("signup")} />
        : <Signup onSwitch={() => setView("login")} />
      }
    </div>
  );
}
