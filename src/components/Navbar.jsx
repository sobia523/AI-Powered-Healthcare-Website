import { useContext, useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { AppContext } from '../App';
import RippleButton from './RippleButton';

function Navbar() {
  const { user, logout, cart } = useContext(AppContext);
  const [menuOpen, setMenuOpen] = useState(false);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  return (
    <header className="navbar-container">
      <nav className="navbar">
        <NavLink to="/" className="nav-brand" onClick={handleLinkClick}>
          <span className="brand-icon">🩺</span> CareConnect
        </NavLink>

        {/* Mobile menu toggle */}
        <button
          className={`menu-toggle ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle Navigation Menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Links */}
        <div className={`nav-links ${menuOpen ? 'mobile-open' : ''}`}>
          <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={handleLinkClick} end>
            Home
          </NavLink>
          <NavLink to="/doctors" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={handleLinkClick}>
            Doctors
          </NavLink>
          <NavLink to="/medicines" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={handleLinkClick}>
            Medicines
          </NavLink>
          <NavLink to="/lab-tests" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={handleLinkClick}>
            Lab Tests
          </NavLink>
          <NavLink to="/blog" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={handleLinkClick}>
            Blog
          </NavLink>
          <NavLink to="/emergency" className={({ isActive }) => `nav-link emergency ${isActive ? 'active' : ''}`} onClick={handleLinkClick}>
            🚨 Emergency
          </NavLink>
          <NavLink to="/contact" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={handleLinkClick}>
            Contact
          </NavLink>

          <hr className="mobile-divider" />

          {/* Cart & Auth Session */}
          <div className="nav-actions">
            <Link to="/cart" className="cart-nav-link" onClick={handleLinkClick}>
              <span className="cart-icon-text">🛒 Cart</span>
              {cartCount > 0 && <span className="cart-badge-count">{cartCount}</span>}
            </Link>

            {user ? (
              <div className="user-profile-menu">
                <span className="user-greeting">Hi, {user.name.split(' ')[0]}</span>
                <RippleButton variant="secondary" onClick={() => { logout(); handleLinkClick(); }} className="logout-btn">
                  Log Out
                </RippleButton>
              </div>
            ) : (
              <Link to="/login" onClick={handleLinkClick}>
                <RippleButton variant="primary" className="login-nav-btn">
                  Sign In
                </RippleButton>
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
