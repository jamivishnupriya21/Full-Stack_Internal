import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Dashboard", icon: "📊", end: true },
  { to: "/assignments", label: "All Assignments", icon: "📋", end: false },
  { to: "/add", label: "Add Assignment", icon: "➕", end: false },
  { to: "/upcoming", label: "Upcoming Deadlines", icon: "⏰", end: false },
];

function Sidebar({ open, onClose }) {
  return (
    <>
      <aside className={`sidebar ${open ? "sidebar-open" : ""}`}>
        <div className="brand">
          <span className="brand-logo">🎓</span>
          <div>
            <h1>StudyTrack</h1>
            <p>Assignment Manager</p>
          </div>
        </div>

        <nav className="nav">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
              onClick={onClose}
            >
              <span className="nav-icon">{link.icon}</span>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">Stay organised. Never miss a deadline.</div>
      </aside>

      {open && <div className="overlay" onClick={onClose}></div>}
    </>
  );
}

export default Sidebar;
