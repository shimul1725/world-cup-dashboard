import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Footer.css"; // styles handling dark mode

/**
 * Minimal Footer component for the World Cup Dashboard.
 * Features:
 *   1. Credit text on the left.
 *   2. Simple contact/navigation links.
 *   3. Smooth "Scroll to Top" button that appears after scrolling.
 *   4. Uses CSS classes that adapt to dark mode (defined in Footer.css).
 */
function Footer() {
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowScroll(window.scrollY > 200);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="footer-left">
          <p className="footer-credit">Made by <span className="footer-credit-name">Moniruzzaman</span></p>
        </div>
        <nav className="footer-nav" aria-label="Footer navigation">
          <Link to="/contact" className="footer-link">Contact</Link>
          <Link to="/about" className="footer-link">About</Link>
          <Link to="/privacy" className="footer-link">Privacy</Link>
        </nav>
      </div>
      {showScroll && (
        <button
          className="scroll-top-btn"
          onClick={scrollToTop}
          aria-label="Scroll to top"
        >
          ↑
        </button>
      )}
    </footer>
  );
}

export default Footer;
