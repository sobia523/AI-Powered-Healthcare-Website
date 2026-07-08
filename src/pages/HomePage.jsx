import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ScrollReveal from '../components/ScrollReveal';
import RippleButton from '../components/RippleButton';

const services = [
  { title: 'Same-Day Consults', desc: 'Book flexible appointments for urgent concerns.' },
  { title: 'Virtual Care', desc: 'Secure remote visits from the comfort of home.' },
  { title: 'Wellness Plans', desc: 'Tailored programs for prevention and long-term health.' }
];

const testimonials = [
  {
    quote: 'The team made everything feel easy and reassuring.',
    name: 'Rina Walker',
    role: 'Patient'
  },
  {
    quote: 'Their blog helped me understand my symptoms before my visit.',
    name: 'Jon Alvarez',
    role: 'Patient'
  },
  {
    quote: 'Fast, trusted support that feels personal every time.',
    name: 'Leah Brooks',
    role: 'Patient'
  }
];

function Counter({ end, label }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1200;
    const stepTime = 16;
    const increment = end / (duration / stepTime);

    const timer = window.setInterval(() => {
      start += increment;
      if (start >= end) {
        setValue(end);
        window.clearInterval(timer);
      } else {
        setValue(Math.floor(start));
      }
    }, stepTime);

    return () => window.clearInterval(timer);
  }, [end]);

  return (
    <div className="stat">
      <strong>{value}+</strong>
      <span>{label}</span>
    </div>
  );
}

function HomePage() {
  const [featuredDocs, setFeaturedDocs] = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch('/api/doctors');
        const data = await res.json();
        // Take first 3 doctors as featured
        setFeaturedDocs(data.slice(0, 3));
      } catch (err) {
        console.error('Error fetching featured doctors:', err);
      } finally {
        setLoadingDocs(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <>
      <section className="hero">
        <ScrollReveal className="hero-card">
          <p className="muted">Trusted care, modern guidance</p>
          <h1>Better health starts with a caring digital experience.</h1>
          <p>
            Discover expert doctors, access practical wellness advice, buy daily health essentials, and schedule lab diagnostics all in one unified portal.
          </p>
          <div className="hero-actions">
            <RippleButton onClick={() => navigate('/blog')} variant="primary">
              Explore Blog
            </RippleButton>
            <RippleButton onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })} variant="secondary">
              View Services
            </RippleButton>
          </div>
        </ScrollReveal>

        <div className="hero-visual">
          <ScrollReveal className="card">
            <div className="doctor-badge">
              <div className="avatar">CC</div>
              <div>
                <strong>CareConnect Online</strong>
                <div className="muted">24/7 health support</div>
              </div>
            </div>
            <p>Connect with specialists, review wellness resources, and stay on top of your health goals.</p>
          </ScrollReveal>
          <ScrollReveal className="card">
            <strong>Why patients choose us</strong>
            <ul className="card-list">
              <li>Fast digital booking</li>
              <li>Transparent health insights</li>
              <li>Friendly care at every step</li>
            </ul>
          </ScrollReveal>
        </div>
      </section>

      {/* Featured Doctors */}
      <ScrollReveal className="section">
        <div className="section-header">
          <h2 className="section-title">Featured Doctors</h2>
          <Link to="/doctors" className="see-all-link">
            See All Doctors →
          </Link>
        </div>
        
        {loadingDocs ? (
          <div className="loading-state">Loading featured specialists...</div>
        ) : (
          <div className="card-grid">
            {featuredDocs.map((doctor) => (
              <article key={doctor.id || doctor._id} className="card doctor-home-card zoom-card">
                <div className="doctor-badge">
                  <div className="avatar">
                    {doctor.name.split(' ').map((word) => word[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <strong>{doctor.name}</strong>
                    <div className="muted">{doctor.role}</div>
                  </div>
                </div>
                <p className="doctor-notes-excerpt">{doctor.notes}</p>
                <div className="doctor-home-footer">
                  <Link to={`/doctors/${doctor.id || doctor._id}`} className="doc-profile-link">
                    View Profile
                  </Link>
                  <Link to={`/book-appointment/${doctor.id || doctor._id}`} className="doc-book-link">
                    Book Slot
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </ScrollReveal>

      <ScrollReveal className="section" id="services">
        <div className="section-header">
          <h2 className="section-title">Services</h2>
          <span className="muted">Support that fits your routine</span>
        </div>
        <div className="card-grid">
          {services.map((service) => (
            <article key={service.title} className="card zoom-card">
              <h3>{service.title}</h3>
              <p>{service.desc}</p>
            </article>
          ))}
        </div>
      </ScrollReveal>

      <ScrollReveal className="section">
        <div className="section-header">
          <h2 className="section-title">Testimonials</h2>
          <span className="muted">Real experiences from our community</span>
        </div>
        <div className="testimonials">
          {testimonials.map((item) => (
            <article key={item.name} className="testimonial">
              <blockquote>“{item.quote}”</blockquote>
              <div className="person">
                <div className="avatar">{item.name.split(' ').map((word) => word[0]).join('').slice(0, 2)}</div>
                <div>
                  <strong>{item.name}</strong>
                  <div>{item.role}</div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </ScrollReveal>

      <ScrollReveal className="section">
        <div className="stats-panel">
          <Counter end={25} label="Specialists" />
          <Counter end={18} label="Years of care" />
          <Counter end={98} label="Patient satisfaction" />
          <Counter end={12} label="Health guides" />
        </div>
      </ScrollReveal>

      <ScrollReveal className="section">
        <div className="cta-panel">
          <div>
            <h2 className="section-title">Ready to feel informed and supported?</h2>
            <p className="muted">Browse our blog for practical advice or book a consultation today.</p>
          </div>
          <div className="hero-actions">
            <RippleButton onClick={() => navigate('/blog')} variant="primary">
              Read Our Blog
            </RippleButton>
            <RippleButton onClick={() => navigate('/doctors')} variant="secondary">
              Book a Visit
            </RippleButton>
          </div>
        </div>
      </ScrollReveal>
    </>
  );
}

export default HomePage;
