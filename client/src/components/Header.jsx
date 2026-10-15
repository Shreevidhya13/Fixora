
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("fixoraLoggedIn") === "true"
  );

  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("fixoraLoggedIn");
    setIsLoggedIn(false);
    setShowProfileMenu(false);
    navigate("/");
  }

  return (
    <header className="fixora-header">
      <div className="header-container">
        <Link to="/" className="fixora-logo">
          Fixora<span>.</span>
        </Link>

        <nav className="header-nav">
          <Link to="/" className="nav-link">
            Home
          </Link>

          <Link to="/#features" className="nav-link">
            Features
          </Link>

          {isLoggedIn ? (
            <>
              <Link to="/report-issue" className="nav-link">
                Report Issue
              </Link>

              <Link to="/my-requests" className="nav-link">
                My Requests
              </Link>

              <Link to="/building-maintenance" className="nav-link">
                Building Maintenance
              </Link>

              <div className="profile-container">
                <button
                  type="button"
                  className="profile-button"
                  aria-label="Open profile menu"
                  aria-expanded={showProfileMenu}
                  onClick={() =>
                    setShowProfileMenu(!showProfileMenu)
                  }
                >
                  👤
                </button>

                {showProfileMenu && (
                  <div className="profile-dropdown">
                    <p className="profile-label">My Account</p>

                    <button
                      type="button"
                      className="profile-logout"
                      onClick={handleLogout}
                    >
                      <span>↪</span> Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Link to="/login" className="nav-link login-link">
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
