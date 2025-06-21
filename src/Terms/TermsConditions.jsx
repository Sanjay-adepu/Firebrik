import React from "react";
import "./TermsConditions.css"; // Import external CSS
import Navbar from "../Nav/Nav.jsx";

const TermsConditions = () => {
  return (
    <>
      <Navbar />

      <div className="terms-container">
        <h1>Terms and Conditions</h1>
        <p>Last Updated: March 2025</p>

        <section>
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using <strong>Firebrik</strong>, including services like the <strong>PPT Maker, AI Chat Assistant, and Caption Generator</strong>, you agree to comply with these Terms and Conditions.
          </p>
        </section>

        <section>
          <h2>2. Use of Our Services</h2>
          <ul>
            <li>Firebrik is provided for personal and professional use.</li>
            <li>Do not misuse, distribute, or attempt to exploit the AI services for illegal activities.</li>
            <li>Generated content must comply with ethical and legal standards.</li>
          </ul>
        </section>

        <section>
          <h2>3. User Responsibilities</h2>
          <ul>
            <li>You are responsible for the content you generate.</li>
            <li>You must not upload harmful, offensive, or illegal materials.</li>
            <li>Firebrik reserves the right to suspend access if violations occur.</li>
          </ul>
        </section>

        <section>
          <h2>4. Intellectual Property</h2>
          <p>
            All content, logos, and AI-generated outputs remain the property of Firebrik unless stated otherwise. Unauthorized reproduction or redistribution is prohibited.
          </p>
        </section>

        <section>
          <h2>5. Limitation of Liability</h2>
          <p>
            Firebrik is provided <strong>as-is</strong>. We are not responsible for inaccuracies in AI-generated content or any damages resulting from the use of our services.
          </p>
        </section>

        <section>
          <h2>6. Third-Party Links & Ads</h2>
          <p>Firebrik may display third-party advertisements or external links. We are not responsible for external site content or policies.</p>
        </section>

        <section>
          <h2>7. Modifications to Terms</h2>
          <p>
            We reserve the right to update these Terms at any time. Changes will be posted on this page, and continued use of Firebrik implies acceptance of modifications.
          </p>
        </section>

        <section>
          <h2>8. Contact Information</h2>
          <p>If you have any questions, contact us at <strong>support@firebrik.com</strong>.</p>
        </section>
      </div>
    </>
  );
};

export default TermsConditions;