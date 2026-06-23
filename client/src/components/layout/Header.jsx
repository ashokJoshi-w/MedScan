import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="bg-white border-b border-border sticky top-0 z-10">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-primary-500 flex items-center justify-center flex-shrink-0">
            <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800 leading-none">MedScan</p>
            <p className="text-xs text-muted mt-0.5">
              {user ? `Signed in as ${user.name}` : "AI medical assistant"}
            </p>
          </div>
        </div>
        {user && (
          <button
            onClick={handleLogout}
            className="text-xs font-medium text-muted hover:text-slate-700 border border-border rounded-lg px-3 py-1.5 hover:bg-slate-50 transition"
          >
            Sign out
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
