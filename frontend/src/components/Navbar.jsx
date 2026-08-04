function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">
        FixMyCity
      </div>

      <div className="nav-links">
        <a href="#">Home</a>
        <a href="#">Report Issue</a>
        <a href="#">Track Complaint</a>
        <a href="/login">Login</a>
      </div>
    </nav>
  );
}

export default Navbar;