import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Home.css";
import Navbar from "../Nav/Nav.jsx";
import Footer from "../Footer.jsx";

import AOS from 'aos';
import 'aos/dist/aos.css';

const Home = () => {
  const images = [
    "https://res.cloudinary.com/dppiuypop/image/upload/v1744734481/uploads/xayqocujbuxvbsji29rl.jpg",
    "https://res.cloudinary.com/dppiuypop/image/upload/v1744734565/uploads/etfbxtg6uwjtrw0yjm4g.jpg",
    "https://res.cloudinary.com/dppiuypop/image/upload/v1744734588/uploads/xam5cvriqypddliexom9.jpg",
    "https://res.cloudinary.com/dppiuypop/image/upload/v1744734612/uploads/ehrfkru4xzffou8qcka1.jpg",
    "https://res.cloudinary.com/dppiuypop/image/upload/v1744734746/uploads/gdiybb044rqcrzjfugng.jpg",
    "https://res.cloudinary.com/dppiuypop/image/upload/v1744734808/uploads/stur5jtbjejhbdfmwmmc.jpg",
    "https://res.cloudinary.com/dppiuypop/image/upload/v1744734835/uploads/j4g7airfuwuvibsqjnqb.jpg",
    "https://res.cloudinary.com/dppiuypop/image/upload/v1744734855/uploads/xvon6yihzhzcxzi8twng.jpg"
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showPopup, setShowPopup] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <>
      <Navbar />

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-box" role="dialog" aria-modal="true" aria-labelledby="popup-title">
            <button
              className="close-btn"
              onClick={() => setShowPopup(false)}
              aria-label="Close popup"
            >
              &times;
            </button>
            <h2 id="popup-title" className="popup-title">Terms & Privacy Policy</h2>
            <p className="popup-text">
              By continuing to use this site, you acknowledge that you have read and agreed to our
              <Link to="/terms" className="popup-link"> Terms of Service</Link> and
              <Link to="/policy" className="popup-link"> Privacy Policy</Link>.
            </p>
          </div>
        </div>
      )}

      <div className="home-page">
        <section className="hero">
 <h1 className="hero-heading"> Create AI-Generated Presentations in Less Than 1 Minute!</h1>  
          <p className="hero-subtext">
            FIREBRIK is an AI-powered platform that instantly converts text into professional presentations, saving hours of manual work. Whether you're a student, educator, or business professional, FIREBRIK helps you create <strong>high-quality, customizable</strong> presentations in under a minute! With intuitive design tools, smart content suggestions, and real-time editing capabilities, FIREBRIK empowers you to focus on ideas while we handle the visuals—making your workflow faster, smarter, and more impactful. Thousands of users globally trust FIREBRIK for its intuitive interface, intelligent design algorithms, and unmatched reliability. Plus, every generated presentation is fully customizable, so you remain in complete creative control — modify images, layouts, colors, and more within seconds. With FIREBRIK, you don't just create presentations — you craft unforgettable stories.
          </p>
          <Link to="/dashboard" className="btn-primary">Get Started</Link>
        </section>

        <section className="features" data-aos="fade-up">
          <h2 className="section-heading">Powerful Features for Effortless Productivity</h2>
          <ul className="why-list">
            <li><strong>🔹 Lightning-Fast AI Response:</strong> Get real-time AI assistance in <strong>less than 12 seconds</strong>.</li>
          
            <li><strong>🔹 No Watermarks:</strong> Download clean, professional slides without branding overlays.</li>
        
            <li><strong>🔹 Theme Selection & Font Customization:</strong> Choose from various themes, title colors, and fonts.</li>
            <li><strong>🔹 AI-Powered Slide Generation:</strong> Convert raw text into well-structured, visually appealing PowerPoint slides instantly.</li>
            <li><strong>🔹 Instant PDF & PPTX Downloads:</strong> Save your presentations in multiple formats for easy sharing.</li>
            <li><strong>🔹 Customization Options:</strong> Modify text, images, fonts, and colors to match your preferences.</li>
          </ul>
        </section>

        <section className="why-choose" data-aos="fade-right">
          <h2 className="section-heading">Why Choose FIREBRIK?</h2>
          <p className="why-description" data-aos="fade-up" data-aos-delay="300">
            FIREBRIK is built for students, educators, and professionals who need <strong>fast, high-quality</strong> presentations. Whether you're preparing for a <strong>business meeting, academic project, or research paper</strong>, FIREBRIK ensures your slides are polished and engaging.
          </p>
          <ul className="why-list">
            <li><strong>🔹 Save Time:</strong> Generate fully designed slides <strong>in under a minute</strong>.</li>
            <li><strong>🔹 AI-Optimized Content:</strong> Get structured, professional-grade content instantly.</li>
            <li><strong>🔹 Easy to Use:</strong> No design skills needed—simply input your text and let AI do the rest.</li>
            <li><strong>🔹 AI-Powered Insights:</strong> Improve slide content with intelligent recommendations.</li>
          </ul>
        </section>

        <section className="cta-section" data-aos="fade-up" data-aos-delay="200">
          <h2 className="cta-heading">Start Creating AI-Powered Presentations Now!</h2>
          <p className="cta-subtext">Join thousands of users who are transforming the way they present. Try FIREBRIK today!</p>
          <Link to="/dashboard" className="btn-primary">Get Started</Link>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default Home;