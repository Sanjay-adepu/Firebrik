import { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="nav-container">
      <div className="nav-inner">
        {/* Logo */}
        <Link to="/" className="nav-logo">
          <img
            src="./file_000000006b74623093a7c5c7b83b549f.png"
            alt="FalconAI Logo"
            className="nav-logo-img"
          />
          <span>Firebrik</span>
        </Link>

        {/* Desktop Navigation */}
        <ul className="nav-links-desktop">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/dashboard">AI PPT Maker</Link></li>

          <li><Link to="/contact">Contact</Link></li>
          <li><Link to="/terms">Terms and Conditions</Link></li>
          <li><Link to="/policy">Privacy Policy</Link></li>
        </ul>

        {/* Hamburger Icon */}
        <button
          className={`nav-toggle-btn ${isMenuOpen ? "open" : ""}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle navigation"
        >
          <div className="nav-toggle-bar"></div>
          <div className="nav-toggle-bar"></div>
          <div className="nav-toggle-bar"></div>
        </button>
      </div>

      {/* Sidebar Navigation for Mobile */}
      <div className={`nav-sidebar ${isMenuOpen ? "open" : ""}`}>
        <ul className="nav-links-mobile">
          <li><Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link></li>
          <li><Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>AI PPT Maker</Link></li>

          <li><Link to="/contact" onClick={() => setIsMenuOpen(false)}>Contact</Link></li>
          <li><Link to="/terms" onClick={() => setIsMenuOpen(false)}>Terms and Conditions</Link></li>
          <li><Link to="/policy" onClick={() => setIsMenuOpen(false)}>Privacy Policy</Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;