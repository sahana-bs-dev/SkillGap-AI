import { NavLink, Outlet } from "react-router-dom";
import "./AppShell.css";

export default function AppShell() {
  // TODO: once user profile data is available from the backend,
  // swap this out for the real logged-in user's name/initials.
  const userName = "Guest";
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
        <div className="user">
          <div className="avatar">{initials}</div>
          <div>
            <div className="name">{userName}</div>
            <div className="role">Free plan</div>
          </div>
        </div>
      </aside>

      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}