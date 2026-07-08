import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AppContext } from '../App';
import ScrollReveal from '../components/ScrollReveal';
import RippleButton from '../components/RippleButton';

const TIME_SLOTS = [
  '09:00 AM', '10:00 AM', '11:00 AM',
  '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
];

function BookAppointment() {
  const { id } = useParams();
  const { user } = useContext(AppContext);
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form states
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [patientName, setPatientName] = useState(user?.name || '');
  const [patientEmail, setPatientEmail] = useState(user?.email || '');
  const [patientPhone, setPatientPhone] = useState('');
  const [notes, setNotes] = useState('');

  // Confirmation states
  const [successData, setSuccessData] = useState(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Redirect to login if user is not authenticated
    if (!user) {
      navigate('/login?redirect=book');
      return;
    }

    const loadDoctors = async () => {
      try {
        const res = await fetch('/api/doctors');
        const data = await res.json();
        setDoctors(data);

        if (id) {
          const doc = data.find((d) => d.id === id || d._id === id);
          if (doc) setSelectedDoctor(doc);
        } else if (data.length > 0) {
          setSelectedDoctor(data[0]);
        }
      } catch (err) {
        console.error('Error fetching doctors:', err);
      } finally {
        setLoading(false);
      }
    };
    loadDoctors();
  }, [id, user, navigate]);

  const handleDoctorChange = (e) => {
    const doc = doctors.find((d) => d.id === e.target.value || d._id === e.target.value);
    setSelectedDoctor(doc);
  };

  const handleBook = async (e) => {
    e.preventDefault();
    setError('');

    if (!selectedDoctor) {
      setError('Please select a doctor.');
      return;
    }
    if (!date) {
      setError('Please select a date.');
      return;
    }
    if (!timeSlot) {
      setError('Please select a time slot.');
      return;
    }
    if (!patientName || !patientEmail || !patientPhone) {
      setError('Please fill in all patient details.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          doctorId: selectedDoctor.id || selectedDoctor._id,
          doctorName: selectedDoctor.name,
          patientName,
          patientEmail,
          patientPhone,
          date,
          timeSlot,
          notes
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to book appointment');
      }

      setSuccessData(data.appointment);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="loading-state">Loading appointment portal...</div>;
  }

  // Get tomorrow's date string for min date in date picker
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDateStr = tomorrow.toISOString().split('T')[0];

  if (successData) {
    return (
      <div className="container">
        <ScrollReveal className="section success-panel-container">
          <div className="card success-card">
            <div className="success-icon">✓</div>
            <h2>Appointment Confirmed!</h2>
            <p className="muted">Your consultation has been successfully scheduled.</p>

            <div className="booking-summary-box">
              <div className="summary-row">
                <strong>Booking ID:</strong>
                <span>{successData.id || successData._id}</span>
              </div>
              <div className="summary-row">
                <strong>Doctor:</strong>
                <span>{successData.doctorName}</span>
              </div>
              <div className="summary-row">
                <strong>Patient Name:</strong>
                <span>{successData.patientName}</span>
              </div>
              <div className="summary-row">
                <strong>Date & Time:</strong>
                <span>{successData.date} at {successData.timeSlot}</span>
              </div>
              <div className="summary-row">
                <strong>Contact Phone:</strong>
                <span>{successData.patientPhone}</span>
              </div>
              {successData.notes && (
                <div className="summary-row">
                  <strong>Special Notes:</strong>
                  <span>{successData.notes}</span>
                </div>
              )}
            </div>

            <p className="success-footer-note">
              A confirmation and meeting details have been registered under <strong>{successData.patientEmail}</strong>.
            </p>

            <div className="success-actions">
              <Link to="/">
                <RippleButton variant="primary">Go to Home</RippleButton>
              </Link>
              <Link to="/doctors">
                <RippleButton variant="secondary">View Other Doctors</RippleButton>
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </div>
    );
  }

  return (
    <div className="container">
      <ScrollReveal className="section">
        <h1 className="section-title">Schedule a Consultation</h1>
        <p className="muted">Choose your specialist and select an available slot.</p>

        {error && <div className="auth-error">{error}</div>}

        <div className="booking-layout">
          <form onSubmit={handleBook} className="booking-form card">
            <div className="form-group">
              <label htmlFor="doctor-select">Select Doctor</label>
              {id ? (
                <input
                  type="text"
                  id="doctor-select"
                  value={selectedDoctor?.name || ''}
                  disabled
                  className="disabled-input"
                />
              ) : (
                <select
                  id="doctor-select"
                  value={selectedDoctor?.id || selectedDoctor?._id || ''}
                  onChange={handleDoctorChange}
                  required
                >
                  {doctors.map((d) => (
                    <option key={d.id || d._id} value={d.id || d._id}>
                      {d.name} ({d.role})
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="booking-datetime-grid">
              <div className="form-group">
                <label htmlFor="booking-date">Choose Date</label>
                <input
                  type="date"
                  id="booking-date"
                  min={minDateStr}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Available Slots</label>
                <div className="time-slots-grid">
                  {TIME_SLOTS.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      className={`time-slot-btn ${timeSlot === slot ? 'active' : ''}`}
                      onClick={() => setTimeSlot(slot)}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <hr />

            <h3>Patient Information</h3>
            <div className="form-group">
              <label htmlFor="patient-name">Patient Name</label>
              <input
                type="text"
                id="patient-name"
                placeholder="Full Name"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                required
              />
            </div>

            <div className="booking-info-grid">
              <div className="form-group">
                <label htmlFor="patient-email">Email Address</label>
                <input
                  type="email"
                  id="patient-email"
                  placeholder="name@example.com"
                  value={patientEmail}
                  onChange={(e) => setPatientEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="patient-phone">Phone Number</label>
                <input
                  type="tel"
                  id="patient-phone"
                  placeholder="+1 (555) 000-0000"
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="patient-notes">Symptoms or Medical History (Optional)</label>
              <textarea
                id="patient-notes"
                rows="3"
                placeholder="Briefly describe your symptoms or any specific context..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <RippleButton type="submit" className="booking-submit-btn w-100" disabled={submitting}>
              {submitting ? 'Scheduling consultation...' : 'Confirm Appointment Booking'}
            </RippleButton>
          </form>

          {selectedDoctor && (
            <div className="booking-sidebar card">
              <div className="sidebar-doc-avatar">
                {selectedDoctor.name.split(' ').map((word) => word[0]).join('').slice(0, 2)}
              </div>
              <h3>{selectedDoctor.name}</h3>
              <span className="sidebar-doc-specialty">{selectedDoctor.role}</span>
              <p className="sidebar-doc-notes">{selectedDoctor.notes}</p>
              <div className="sidebar-rating">★ {selectedDoctor.rating} rating</div>
              <div className="sidebar-exp">Experience: {selectedDoctor.experience}</div>
            </div>
          )}
        </div>
      </ScrollReveal>
    </div>
  );
}

export default BookAppointment;
