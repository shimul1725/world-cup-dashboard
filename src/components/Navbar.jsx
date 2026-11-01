import { Link, useLocation } from "react-router-dom";
import "../App.css";

function Navbar() {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;

    return (
        <nav className="navbar">
            {/* BRAND LOGO WITH TROPHY/FOOTBALL ICON */}
            <Link to="/" className="nav-brand">
                <div className="logo-badge">
                    <svg className="trophy-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L15 6.5H9L12 2Z" fill="#F59E0B" />
                        <path d="M5 7C5 5.89543 5.89543 5 7 5H17C18.1046 5 19 5.89543 19 7V10C19 13.3137 16.3137 16 13 16H11C7.68629 16 5 13.3137 5 10V7Z" fill="#FBBF24" />
                        <path d="M12 16V20M8 20H16" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
                        <circle cx="12" cy="10.5" r="2.2" fill="#0F172A" />
                    </svg>
                </div>
                <div className="logo-text">
                    <span className="logo-title">World Cup</span>
                    <span className="logo-sub">PREDICTOR</span>
                </div>
            </Link>

            {/* NAV LINKS */}
            <div className="nav-links">
                <Link to="/" className={isActive("/") ? "active" : ""}>
                    Home
                </Link>
                <Link to="/matches" className={isActive("/matches") ? "active" : ""}>
                    Match Center
                </Link>
                <Link to="/compare" className={isActive("/compare") ? "active" : ""}>
                    Compare
                </Link>
                <Link to="/players" className={isActive("/players") ? "active" : ""}>
                    Players
                </Link>
                <Link to="/prediction" className={isActive("/prediction") ? "active" : ""}>
                    Prediction
                </Link>
                <Link to="/market-values" className={isActive("/market-values") ? "active" : ""}>
                    Market Values
                </Link>
            </div>
        </nav>
    );
}

export default Navbar;