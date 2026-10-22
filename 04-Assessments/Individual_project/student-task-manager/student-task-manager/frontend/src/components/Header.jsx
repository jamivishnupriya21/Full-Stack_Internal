import { Link, useLocation } from "react-router-dom";

function getPageInfo(pathname) {
  if (pathname === "/") {
    return { title: "Dashboard", subtitle: "Your academic progress at a glance" };
  }
  if (pathname === "/assignments") {
    return { title: "All Assignments", subtitle: "Search, filter and manage every assignment" };
  }
  if (pathname === "/add") {
    return { title: "Add Assignment", subtitle: "Create a new assignment" };
  }
  if (pathname.startsWith("/edit/")) {
    return { title: "Edit Assignment", subtitle: "Update the assignment details" };
  }
  if (pathname === "/upcoming") {
    return { title: "Upcoming Deadlines", subtitle: "What needs your attention next" };
  }
  return { title: "Page Not Found", subtitle: "This page does not exist" };
}

function Header({ onMenuClick }) {
  const { pathname } = useLocation();
  const { title, subtitle } = getPageInfo(pathname);
  const onFormPage = pathname === "/add" || pathname.startsWith("/edit/");

  return (
    <header className="header">
      <button className="menu-btn" onClick={onMenuClick} aria-label="Open menu">
        ☰
      </button>
      <div className="header-text">
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
      {!onFormPage && (
        <Link to="/add" className="btn btn-primary">
          + Add Assignment
        </Link>
      )}
    </header>
  );
}

export default Header;
