import { useState } from 'react';
import ScrollReveal from '../components/ScrollReveal';
import RippleButton from '../components/RippleButton';

function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!name || !email || !message) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, phone, message })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit form.');
      }

      setSuccess(true);
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <ScrollReveal className="section">
        <h1 className="section-title">Get in Touch</h1>
        <p className="muted">Send us a message or visit our clinic. We are here to support your wellness journey.</p>

        <div className="contact-layout">
          {/* Left panel - Form */}
          <div className="contact-form-container card">
            <h2>Send Us a Message</h2>
            
            {error && <div className="auth-error">{error}</div>}
            {success && <div className="auth-success">✓ Thank you! Your message has been sent successfully.</div>}

            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="contact-name">Full Name *</label>
                <input
                  type="text"
                  id="contact-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name"
                  required
                />
              </div>

              <div className="booking-info-grid">
                <div className="form-group">
                  <label htmlFor="contact-email">Email Address *</label>
                  <input
                    type="email"
                    id="contact-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="contact-phone">Phone Number (Optional)</label>
                  <input
                    type="tel"
                    id="contact-phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="contact-msg">Your Message *</label>
                <textarea
                  id="contact-msg"
                  rows="4"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can our healthcare team help you?"
                  required
                />
              </div>

              <RippleButton type="submit" className="booking-submit-btn w-100" disabled={loading}>
                {loading ? 'Sending message...' : 'Submit Message'}
              </RippleButton>
            </form>
          </div>

          {/* Right panel - Info & Map */}
          <div className="contact-info-column">
            <div className="card contact-details-card">
              <h3>Office Information</h3>
              <p className="contact-detail-row">
                <strong>📞 Phone Support:</strong>
                <a href="tel:+15551002000" className="contact-link">
                  +1 (555) 100-2000
                </a>
              </p>
              <p className="contact-detail-row">
                <strong>✉️ General Inquiries:</strong>
                <a href="mailto:support@careconnect.org" className="contact-link">
                  support@careconnect.org
                </a>
              </p>
              <p className="contact-detail-row">
                <strong>📍 Clinical Facility:</strong>
                <span>789 Wellness Boulevard, Suite A, Metropolis, NY 10001</span>
              </p>
              <p className="contact-detail-row">
                <strong>🕒 Active Hours:</strong>
                <span>Monday - Friday: 8:00 AM - 6:00 PM • Saturday: 9:00 AM - 2:00 PM</span>
              </p>
            </div>

            <div className="card contact-map-card">
              <h3>Our Location</h3>
              <div className="map-iframe-container">
                <iframe
                  title="CareConnect Clinical Facility"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.25279984888!2d-74.11976378305844!3d40.69767006399166!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
                  width="100%"
                  height="220"
                  style={{ border: 0, borderRadius: '16px' }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}

export default ContactPage;
