import { Link } from "react-router-dom";
import { useState } from "react";

function Navbar() {
  const [user] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  return (
    <nav className="navbar">
      <div className="logo">
        FixMyCity
      </div>

      <div className="nav-links">
        <Link to="/home">Home</Link>
        <Link to="/report">Report Issue</Link>
        <Link to="/track">Track Complaint</Link>
        {user && user.role === "admin" && (
          <Link to="/admin">Admin Dashboard</Link>
        )}
        {user && user.role === "department" && (
          <Link to="/department">Department Dashboard</Link>
        )}
        {user ? (
          <button
            onClick={() => {
              localStorage.removeItem("user");
              window.location.href = "/login";
            }}
          >
            Logout
          </button>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;