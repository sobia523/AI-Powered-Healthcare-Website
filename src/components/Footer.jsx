import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="footer-section">
      <div className="container footer-grid">
        <div className="footer-brand-col">
          <h2 className="footer-logo">🩺 CareConnect</h2>
          <p className="muted">
            Connecting you with top medical specialists, digital pharmacy services, and lab diagnostic packages.
          </p>
          <div className="footer-socials">
            <span>🔵 Facebook</span>
            <span>🟣 Instagram</span>
            <span>🔷 Twitter</span>
          </div>
        </div>

        <div className="footer-links-col">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home Dashboard</Link></li>
            <li><Link to="/doctors">Our Doctors</Link></li>
            <li><Link to="/medicines">Pharmacy Store</Link></li>
            <li><Link to="/lab-tests">Lab Screenings</Link></li>
            <li><Link to="/blog">Health Articles</Link></li>
          </ul>
        </div>

        <div className="footer-contact-col">
          <h3>Contact Info</h3>
          <p>📞 Phone: +1 (555) 100-2000</p>
          <p>✉️ Email: support@careconnect.org</p>
          <p>📍 Address: 789 Wellness Boulevard, Suite A, Metropolis, NY 10001</p>
        </div>
      </div>
      
      <div className="footer-bottom text-center">
        <p className="muted">© 2026 CareConnect Healthcare Portal. Caring for healthier lives every day.</p>
      </div>
    </footer>
  );
}

export default Footer;
