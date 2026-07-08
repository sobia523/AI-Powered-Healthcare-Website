import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../App';
import ScrollReveal from '../components/ScrollReveal';
import RippleButton from '../components/RippleButton';

function LabTestsPage() {
  const { user } = useContext(AppContext);
  const navigate = useNavigate();

  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal & form booking states
  const [bookingTest, setBookingTest] = useState(null); // active test to book
  const [patientName, setPatientName] = useState(user?.name || '');
  const [patientEmail, setPatientEmail] = useState(user?.email || '');
  const [patientPhone, setPatientPhone] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  
  const [successBooking, setSuccessBooking] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const res = await fetch('/api/lab-tests');
        let data;
        try { data = await res.json(); } catch { data = null; }
        if (Array.isArray(data)) setTests(data);
      } catch (err) {
        console.error('Error fetching lab tests:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTests();
  }, []);

  const handleOpenBookingModal = (test) => {
    if (!user) {
      navigate('/login?redirect=lab-tests');
      return;
    }
    setBookingTest(test);
    setSuccessBooking(null);
    setError('');
  };

  const handleCloseModal = () => {
    setBookingTest(null);
    setSuccessBooking(null);
    setError('');
  };

  const handleBookTest = async (e) => {
    e.preventDefault();
    setError('');

    if (!bookingDate) {
      setError('Please select a date for the test.');
      return;
    }
    if (!patientName || !patientEmail || !patientPhone) {
      setError('Please fill out all patient information.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/lab-bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          testName: bookingTest.name,
          patientName,
          patientEmail,
          patientPhone,
          date: bookingDate,
          price: bookingTest.price
        })
      });

      const data = await res.json().catch(() => null);
      if (!data) {
        throw new Error('Backend server is not running. Please start it with: npm run dev:full');
      }
      if (!res.ok) {
        throw new Error(data.error || 'Failed to book test');
      }

      setSuccessBooking(data.booking);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <ScrollReveal className="section">
        <div className="section-header-row">
          <div>
            <p className="muted">Book clinical diagnostic screenings online</p>
            <h1 className="section-title">Laboratory Diagnostic Tests</h1>
          </div>
        </div>

        {loading ? (
          <div className="loading-state">Loading available screenings...</div>
        ) : (
          <div className="lab-tests-grid">
            {tests.map((test) => (
              <div key={test.id || test._id} className="lab-test-card card zoom-card">
                <div className="lab-card-header">
                  <span className="lab-test-category">{test.category}</span>
                  <span className="lab-test-duration">🕒 Reports in {test.duration}</span>
                </div>
                <h3>{test.name}</h3>
                <p className="lab-test-desc">{test.description}</p>
                
                <div className="lab-card-footer">
                  <span className="lab-test-price">${test.price.toFixed(2)}</span>
                  <RippleButton variant="primary" onClick={() => handleOpenBookingModal(test)}>
                    Book Test
                  </RippleButton>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollReveal>

      {/* Booking Modal */}
      {bookingTest && (
        <div className="modal-backdrop">
          <div className="modal-content card">
            <button className="modal-close-btn" onClick={handleCloseModal} aria-label="Close Modal">
              ✕
            </button>

            {successBooking ? (
              <div className="modal-success-state">
                <div className="success-icon">✓</div>
                <h2>Lab Test Scheduled!</h2>
                <p className="muted">Your slot for the lab test has been confirmed.</p>

                <div className="booking-summary-box">
                  <div className="summary-row">
                    <strong>Test Name:</strong>
                    <span>{successBooking.testName}</span>
                  </div>
                  <div className="summary-row">
                    <strong>Patient Name:</strong>
                    <span>{successBooking.patientName}</span>
                  </div>
                  <div className="summary-row">
                    <strong>Scheduled Date:</strong>
                    <span>{successBooking.date}</span>
                  </div>
                  <div className="summary-row">
                    <strong>Cost:</strong>
                    <span>${successBooking.price.toFixed(2)}</span>
                  </div>
                  <div className="summary-row">
                    <strong>Status:</strong>
                    <span>{successBooking.status}</span>
                  </div>
                </div>

                <p className="success-footer-note">
                  Please visit the CareConnect Diagnostic Center on your selected date. Bring a government ID.
                </p>

                <RippleButton variant="primary" onClick={handleCloseModal} className="w-100">
                  Got It
                </RippleButton>
              </div>
            ) : (
              <form onSubmit={handleBookTest} className="modal-form">
                <h2>Book Diagnostic Test</h2>
                <h3 className="modal-sub-title">{bookingTest.name}</h3>
                <span className="modal-price-tag">Total: ${bookingTest.price.toFixed(2)}</span>

                {error && <div className="auth-error">{error}</div>}

                <div className="form-group">
                  <label htmlFor="lab-date">Preferred Date</label>
                  <input
                    type="date"
                    id="lab-date"
                    min={new Date(Date.now() + 86400000).toISOString().split('T')[0]} // tomorrow
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="lab-patient">Patient Name</label>
                  <input
                    type="text"
                    id="lab-patient"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="Full Name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="lab-email">Email Address</label>
                  <input
                    type="email"
                    id="lab-email"
                    value={patientEmail}
                    onChange={(e) => setPatientEmail(e.target.value)}
                    placeholder="name@example.com"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="lab-phone">Phone Number</label>
                  <input
                    type="tel"
                    id="lab-phone"
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    required
                  />
                </div>

                <RippleButton type="submit" className="w-100 booking-submit-btn" disabled={submitting}>
                  {submitting ? 'Booking appointment...' : 'Confirm Lab Appointment'}
                </RippleButton>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default LabTestsPage;
