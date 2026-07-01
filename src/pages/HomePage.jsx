import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ScrollReveal from '../components/ScrollReveal';
import RippleButton from '../components/RippleButton';

const doctors = [
  { name: 'Dr. Maya Chen', role: 'Cardiology', notes: 'Specialist in preventive heart care.' },
  { name: 'Dr. Imran Patel', role: 'Pediatrics', notes: 'Compassionate care for growing families.' },
  { name: 'Dr. Sara Gomez', role: 'Nutrition', notes: 'Personalized meal planning and wellness support.' }
];

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
  return (
    <>
      <section className="hero">
        <ScrollReveal className="hero-card">
          <p className="muted">Trusted care, modern guidance</p>
          <h1>Better health starts with a caring digital experience.</h1>
          <p>
            Discover expert doctors, access practical wellness advice, and stay informed with a modern health blog built for everyday life.
          </p>
          <div className="hero-actions">
            <RippleButton onClick={() => window.location.assign('/blog')} variant="primary">Explore Blog</RippleButton>
            <RippleButton onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })} variant="secondary">View Services</RippleButton>
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

      <ScrollReveal className="section">
        <div className="section-header">
          <h2 className="section-title">Featured Doctors</h2>
          <span className="muted">Meet the experts behind your care</span>
        </div>
        <div className="card-grid">
          {doctors.map((doctor) => (
            <article key={doctor.name} className="card">
              <div className="doctor-badge">
                <div className="avatar">{doctor.name.split(' ').map((word) => word[0]).join('')}</div>
                <div>
                  <strong>{doctor.name}</strong>
                  <div className="muted">{doctor.role}</div>
                </div>
              </div>
              <p>{doctor.notes}</p>
            </article>
          ))}
        </div>
      </ScrollReveal>

      <ScrollReveal className="section" id="services">
        <div className="section-header">
          <h2 className="section-title">Services</h2>
          <span className="muted">Support that fits your routine</span>
        </div>
        <div className="card-grid">
          {services.map((service) => (
            <article key={service.title} className="card">
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
            <RippleButton onClick={() => window.location.assign('/blog')} variant="primary">Read Our Blog</RippleButton>
            <RippleButton onClick={() => window.location.assign('/')} variant="secondary">Book a Visit</RippleButton>
          </div>
        </div>
      </ScrollReveal>
    </>
  );
}

export default HomePage;
