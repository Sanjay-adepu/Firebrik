import React from "react";
import "./PrivacyPolicy.css"; // Import external CSS
import Navbar from "../Nav/Nav.jsx";

const PrivacyPolicy = () => {
  return (
    <>
      <Navbar />
      <div className="privacy-container">
        <h1>Privacy Policy</h1>
        <p>Last Updated: March 2025</p>

        <section>
          <h2>1. Introduction</h2>
          <p>
            Welcome to <strong>Firebrik</strong>. Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your data when using our services, including the <strong>PPT Maker, AI Chat Assistant, and Caption Generator</strong>.
          </p>
        </section>

        <section>
          <h2>2. Information We Collect</h2>
          <ul>
            <li><strong>Personal Data:</strong> If you contact us, we may collect your email.</li>
            <li><strong>Usage Data:</strong> We collect non-personal data like IP addresses, browser types, and time spent on our platform.</li>
            <li><strong>Generated Content:</strong> Any PPTs, captions, or AI responses you generate are stored temporarily.</li>
          </ul>
        </section>

        <section>
          <h2>3. How We Use Your Data</h2>
          <ul>
            <li>To provide and improve Firebrik’s services.</li>
            <li>To analyze website performance and user behavior.</li>
            <li>To enhance AI-generated responses.</li>
          </ul>
        </section>

        <section>
          <h2>4. Cookies & Tracking Technologies</h2>
          <p>We use cookies to optimize your experience. You can disable them in your browser settings.</p>
        </section>

        <section>
          <h2>5. Third-Party Services</h2>
          <p>Firebrik may display ads and use analytics tools. These third parties may collect certain information as per their policies.</p>
        </section>

        <section>
          <h2>6. Data Security</h2>
          <p>We take security seriously and implement safeguards to protect your data, but no online service is 100% secure.</p>
        </section>

        <section>
          <h2>7. Your Rights</h2>
          <p>You have the right to request data deletion or modification by contacting us.</p>
        </section>

        <section>
          <h2>8. Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. Changes will be posted on this page.</p>
        </section>

        <section>
          <h2>9. Contact Us</h2>
          <p>If you have any questions, contact us at <strong>support@firebrik.com</strong>.</p>
        </section>
      </div>
    </>
  );
};

export default PrivacyPolicy;