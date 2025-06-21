import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Left: Branding */}
        <div className="footer-brand">
          <h3>FIREBRIK</h3>
          <p>Next-gen AI tool for effortless presentations.</p>
        </div>

        {/* Right: Links */}
        <div className="footer-links">
          <ul>
            <li><Link to="/terms">Terms & Conditions</Link></li>
            <li><Link to="/policy">Privacy Policy</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} FalconAI. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;