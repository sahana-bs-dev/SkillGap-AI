import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./AppShell.css";

export default function AppShell() {
  const { userName: contextUserName, logout } = useAuth();
  const navigate = useNavigate();
  const userName = contextUserName || "Guest";
  const initials = userName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="mark">✦ SkillGap AI</div>
        <nav>
          <NavLink
            to="/upload"
            className={({ isActive }) => (isActive ? "current" : "")}
          >
            <span className="dot"></span> Dashboard
          </NavLink>
          <NavLink
            to="/report"
            className={({ isActive }) => (isActive ? "current" : "")}
          >
            <span className="dot"></span> Latest report
          </NavLink>
          <NavLink
            to="/compare"
            className={({ isActive }) => (isActive ? "current" : "")}
          >
            <span className="dot"></span> Compare history
          </NavLink>
        </nav>
        <div className="spacer"></div>
        <div className="sidebar-footer">
          <div className="user">
            <div className="avatar">{initials}</div>
            <div>
              <div className="name">{userName}</div>
              <div className="role">Free plan</div>
            </div>
          </div>
          <button
            className="logout-btn"
            onClick={() => {
              logout();
              navigate("/");
            }}
          >
            Log out
          </button>
        </div>
      </aside>

      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}